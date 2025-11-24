const Review = require('../models/Review');

// 1. (테스트용) 리뷰 강제 생성
// Postman에서 테스트할 때 사용
exports.createReview = async (req, res) => {
    try {
        const review = await Review.create(req.body);
        res.status(201).json({ message: '리뷰 작성 성공', review });
    } catch (error) {
        res.status(500).json({ message: '작성 실패', error: error.message });
    }
};

// 2. 전체 리뷰 조회 (관리자/Staff용 - 필터링 강화)
// - ?status=reported : 신고된 리뷰만 보기
// - ?isVisible=false : 숨겨진(삭제된) 리뷰만 보기
// - ?lodgingId=... : 특정 숙소 리뷰만 보기
exports.getAllReviews = async (req, res) => {
    try {
        const { lodgingId, isVisible, status } = req.query;
        const filter = {};

        // 1. 숙소별 필터
        if (lodgingId) filter.lodging = lodgingId;

        // 2. 숨김 여부 필터 (true: 공개만, false: 숨김만)
        if (isVisible !== undefined) {
            filter.isVisible = isVisible === 'true';
        }

        // 3. 상태 필터 (active, reported, hidden)
        if (status) filter.status = status;

        const reviews = await Review.find(filter)
            .populate('user', 'name email status') // 작성자 정보 (밴 처리를 위해 필요)
            .populate('lodging', 'name')           // 숙소 이름
            .sort({ createdAt: -1 });              // 최신순 정렬

        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ message: '서버 오류', error: error.message });
    }
};

// 3. 리뷰 숨김/공개 처리 (관리자/Staff 직권 처리)
// - 모니터링 중 발견 즉시 삭제하거나, 신고된 리뷰를 최종 삭제 처리할 때 사용
exports.toggleReviewVisibility = async (req, res) => {
    try {
        const { isVisible, adminComment } = req.body; // false로 보내면 숨김 처리

        // 숨길 때 status도 'hidden'으로 자동 변경 (관리 편의성)
        const updateData = {
            isVisible,
            adminComment // 관리자가 남긴 메모 저장
        };

        if (isVisible === false) {
            updateData.status = 'hidden'; // 숨김 -> 상태도 hidden
        } else {
            updateData.status = 'active'; // 공개 -> 상태도 active 복구
        }

        const review = await Review.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );

        if (!review) {
            return res.status(404).json({ message: '리뷰를 찾을 수 없습니다.' });
        }

        res.status(200).json({
            message: `리뷰 상태가 ${isVisible ? '공개' : '숨김(삭제)'}로 변경되었습니다.`,
            review
        });
    } catch (error) {
        res.status(500).json({ message: '상태 변경 실패', error: error.message });
    }
};

// 4. 리뷰 신고 접수 (사업자용)
// - 사업자가 악성 리뷰를 발견하고 신고할 때 사용
exports.reportReview = async (req, res) => {
    try {
        const { reason } = req.body; // 신고 사유

        // 이미 숨겨진(hidden) 리뷰는 신고할 필요 없으므로 체크
        const targetReview = await Review.findById(req.params.id);
        if (!targetReview) {
            return res.status(404).json({ message: '리뷰를 찾을 수 없습니다.' });
        }
        if (targetReview.status === 'hidden') {
            return res.status(400).json({ message: '이미 삭제된 리뷰입니다.' });
        }

        // 상태를 'reported'로 변경하고 사유 저장
        const review = await Review.findByIdAndUpdate(
            req.params.id,
            {
                status: 'reported',
                reportReason: reason
            },
            { new: true }
        );

        res.status(200).json({ message: '리뷰가 신고되었습니다.', review });
    } catch (error) {
        res.status(500).json({ message: '신고 처리 실패', error: error.message });
    }
};