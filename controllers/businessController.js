const business = require('../models/Business');

// 1. 모든 파트너 목록 조회 (또는 필터링)
// (예: /api/businesss?status=pending => 승인대기 목록만)
exports.getAllbusinesss = async (req, res) => {
    try {
        const query = {};

        // 쿼리스트링에 status가 있으면 해당 상태의 파트너만 조회
        if (req.query.status) {
            query.status = req.query.status;
        }

        const businesss = await business.find(query).select('-password'); // 비밀번호 제외
        res.status(200).json(businesss);

    } catch (error) {
        res.status(500).json({ message: '서버 오류', error: error.message });
    }
};

// 2. 특정 파트너 상세 조회
exports.getbusinessById = async (req, res) => {
    try {
        const business = await business.findById(req.params.businessId).select('-password');
        if (!business) {
            return res.status(404).json({ message: '파트너를 찾을 수 없습니다.' });
        }
        res.status(200).json(business);

    } catch (error) {
        res.status(500).json({ message: '서버 오류', error: error.message });
    }
};

// 3. [핵심] 파트너 상태 변경 (승인/거절/정지)
exports.updatebusinessStatus = async (req, res) => {
    try {
        const { businessId } = req.params;
        const { status, adminNotes } = req.body; // 'approved', 'rejected' 등이 body로 전달됨

        // 유효한 상태 값인지 확인 (옵션이지만 권장)
        const allowedStatus = ['pending', 'approved', 'rejected', 'suspended'];
        if (!allowedStatus.includes(status)) {
            return res.status(400).json({ message: '유효하지 않은 상태 값입니다.' });
        }

        const business = await business.findById(businessId);
        if (!business) {
            return res.status(404).json({ message: '파트너를 찾을 수 없습니다.' });
        }

        // 상태 및 관리자 메모 업데이트
        business.status = status;
        if (adminNotes) {
            business.adminNotes = adminNotes; // (예: 거절 사유)
        }

        await business.save();

        res.status(200).json({
            message: '파트너 상태가 성공적으로 업데이트되었습니다.',
            business: business.status,
        });

    } catch (error) {
        res.status(500).json({ message: '서버 오류', error: error.message });
    }
};