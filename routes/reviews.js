const express = require('express');
const router = express.Router();
const {
    createReview,
    getAllReviews,
    toggleReviewVisibility,
    reportReview // ⭐️ 추가된 컨트롤러 가져오기
} = require('../controllers/reviewController');

const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// 모든 라우트에 로그인 필수 적용
router.use(protect);

// 1. 전체 리뷰 조회 (관리자, Staff)
// - ?status=reported, ?isVisible=false 등의 필터링 사용 가능
router.get('/', authorize('admin', 'staff'), getAllReviews);

// 2. 리뷰 숨김/공개 처리 (관리자, Staff) 
// - 모니터링 중 즉시 삭제하거나, 신고된 건 처리
router.patch('/:id/visibility', authorize('admin', 'staff'), toggleReviewVisibility);

// 3. 리뷰 신고 접수 (사업자 전용) 
// - 사업자가 악성 리뷰를 신고할 때 사용
router.post('/:id/report', authorize('business'), reportReview);

// 4. (테스트용) 리뷰 강제 생성 (관리자만)
router.post('/', authorize('admin'), createReview);


///api/reviews?status=reported 신고접수 텝 이런식으로 api 사용하면 좋아요

module.exports = router;