import express from 'express';
import * as promotionController from './controller.js';
import { verifyToken as protect } from '../common/authMiddleware.js';
import { authorize } from '../common/roleMiddleware.js';

const router = express.Router();

// ⚠️ 중요: 구체적인 라우트를 먼저 정의해야 함 (/:id/status가 /:id보다 먼저 와야 함)

// 1. 목록 조회 (GET /api/admin/promotions)
// 관리자 백엔드이므로 기본적으로 protect(로그인) 필요
router.get(
    '/',
    protect,
    promotionController.getAllPromotions
);

// 2. 생성 (POST /api/admin/promotions)
// 생성은 오직 'admin'만 가능
router.post(
    '/',
    protect,
    authorize('admin'),
    promotionController.createPromotion
);

// 3. 상태 업데이트 (PATCH /api/admin/promotions/:id/status)
// ⚠️ /:id보다 먼저 와야 함 (구체적인 경로를 먼저 매칭)
// 상태 변경은 오직 'admin'만 가능
router.patch(
    '/:id/status',
    protect,
    authorize('admin'),
    promotionController.updatePromotionStatus
);

// 4. 상세 조회 (GET /api/admin/promotions/:id)
router.get(
    '/:id',
    protect,
    (req, res, next) => {
        console.log('🔍 GET /:id 라우트 매칭됨, ID:', req.params.id);
        next();
    },
    promotionController.getPromotionById
);

// 5. 수정 (PUT /api/admin/promotions/:id)
// 수정은 오직 'admin'만 가능
router.put(
    '/:id',
    protect,
    authorize('admin'),
    promotionController.updatePromotion
);

// 6. 삭제 (DELETE /api/admin/promotions/:id)
// 삭제도 오직 'admin'만 가능
router.delete(
    '/:id',
    protect,
    authorize('admin'),
    promotionController.deletePromotion
);

export default router;