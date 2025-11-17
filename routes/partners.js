const express = require('express');
const router = express.Router();
const {
    getAllPartners,
    getPartnerById,
    updatePartnerStatus
} = require('../controllers/partnerController');

// [중요] 인증 및 권한 미들웨어 불러오기
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// === 파트너 관리 API ===
// 이 라우터의 모든 경로는 'admin' 권한이 필요합니다.

// 1. (GET) /api/partners - 모든 파트너 조회 (또는 필터링)
router.get(
    '/',
    protect,
    authorize('admin', 'staff'), // 'staff'(CS)도 조회는 가능하게
    getAllPartners
);

// 2. (GET) /api/partners/:partnerId - 특정 파트너 상세 조회
router.get(
    '/:partnerId',
    protect,
    authorize('admin', 'staff'), // 'staff'(CS)도 조회는 가능하게
    getPartnerById
);

// 3. (PATCH) /api/partners/:partnerId/status - [핵심] 파트너 상태 변경
// (오직 'admin'만 승인/거절 가능)
router.patch(
    '/:partnerId/status',
    protect,
    authorize('admin'), // 'admin'만 가능
    updatePartnerStatus
);

module.exports = router;