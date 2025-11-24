const express = require('express');
const router = express.Router();

// 컨트롤러 불러오기
const {
    createLodging,
    getMyLodgings,
    getAllLodgings,
    getLodgingById,
    updateLodging,
    deleteLodging
} = require('../controllers/lodgingController');

// 객실 컨트롤러 불러오기
const { getRoomsByLodgingId } = require('../controllers/roomController');

const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// 1. 전체 목록 조회 (관리자만)
// 순서 중요: /:id 보다 위에 있어야 함
router.get('/all', protect, authorize('admin'), getAllLodgings);

// 2. 내 숙소 목록 조회 (사업자만)
// 순서 중요: /:id 보다 위에 있어야 함
router.get('/my', protect, authorize('business'), getMyLodgings);

// 3. 숙소 등록 (사업자만)
router.post('/', protect, authorize('business'), createLodging);

// 4. 특정 숙소의 객실 목록 조회 (누구나 가능)
// (상세 조회와 묶어서 관리하기 위해 이 위치 추천)
router.get('/:id/rooms', getRoomsByLodgingId);

// 5. 숙소 상세 조회 (로그인한 누구나)
router.get('/:id', protect, getLodgingById);

// 6. 숙소 수정/삭제 (사업자, 관리자)
router.put('/:id', protect, authorize('business', 'admin'), updateLodging);
router.delete('/:id', protect, authorize('business', 'admin'), deleteLodging);

module.exports = router;