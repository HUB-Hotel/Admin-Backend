// routes/auth.js

const express = require('express');
const router = express.Router();

const { registerAdmin, loginAdmin, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// POST /api/auth/login (로그인)
router.post('/login', loginAdmin);

// POST /api/auth/register (새 관리자 계정 생성)
// ⭐️ 'superadmin' -> 'admin'으로 변경
router.post(
    '/register',
    //protect,
    //authorize('admin'), // 포스트맨 테스트중... 관리자 보호 로그인 때문에 주석처리
    registerAdmin
);

// GET /api/auth/me (내 정보 조회)
// ⭐️ 'admin'과 'staff' 모두 접근 가능하도록 수정
router.get(
    '/me',
    protect,
    authorize('admin', 'staff'), // 'admin', 'staff' 모두 자기 정보 조회 가능
    getMe
);

module.exports = router;