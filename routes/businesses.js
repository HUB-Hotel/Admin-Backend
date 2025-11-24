const express = require('express');
const router = express.Router();
const {
    getAllbusinesss,
    getbusinessById,
    updatebusinessStatus
} = require('../controllers/businessController');

// [중요] 인증 및 권한 미들웨어 불러오기
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// === 파트너 관리 API ===
// 이 라우터의 모든 경로는 'admin' 권한이 필요합니다.

// 1. (GET) /api/businesss - 모든 파트너 조회 (또는 필터링)
router.get(
    '/',
    protect,
    authorize('admin', 'staff'), // 'staff'(CS)도 조회는 가능하게
    getAllbusinesss
);

// 2. (GET) /api/businesss/:businessId - 특정 파트너 상세 조회
router.get(
    '/:businessId',
    protect,
    authorize('admin', 'staff'), // 'staff'(CS)도 조회는 가능하게
    getbusinessById
);

// 3. (PATCH) /api/businesss/:businessId/status - [핵심] 파트너 상태 변경
// (오직 'admin'만 승인/거절 가능)
router.patch(
    '/:businessId/status',
    protect,
    authorize('admin'), // 'admin'만 가능
    updatebusinessStatus
);

module.exports = router;