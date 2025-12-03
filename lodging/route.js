import express from 'express';
import * as lodgingController from './controller.js';

import { verifyToken as protect } from '../common/authMiddleware.js';
import { authorize } from '../common/roleMiddleware.js';

const router = express.Router();

// 1. 내 숙소 목록 조회 (사업자만)
router.get(
    '/my',
    protect,
    authorize('business'),
    lodgingController.getMyLodgings
);

// 2. 숙소 등록 (사업자만)
router.post(
    '/',
    protect,
    authorize('business'),
    lodgingController.createLodging
);

// 3. 숙소 상세 조회 (로그인한 누구나)
router.get(
    '/:id',
    protect,
    lodgingController.getLodgingById
);

// 4. 숙소 수정/삭제 (사업자, 관리자)
router.put(
    '/:id',
    protect,
    authorize('business', 'admin'),
    lodgingController.updateLodging
);

router.delete(
    '/:id',
    protect,
    authorize('business', 'admin'),
    lodgingController.deleteLodging
);

export default router;