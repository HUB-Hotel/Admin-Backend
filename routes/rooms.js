const express = require('express');
const router = express.Router();
const {
    createRoom,
    updateRoom,
    deleteRoom
} = require('../controllers/roomController');

const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// 객실 생성 (사업자만)
router.post('/', protect, authorize('business'), createRoom);

// 📌 [수정됨] 객실 수정 (사업자 + 관리자도 가능하게)
router.put('/:id', protect, authorize('business', 'admin'), updateRoom);

// 📌 [수정됨] 객실 삭제 (사업자 + 관리자도 가능하게)
router.delete('/:id', protect, authorize('business', 'admin'), deleteRoom);

module.exports = router;