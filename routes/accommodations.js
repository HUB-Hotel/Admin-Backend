const express = require('express');
const router = express.Router();

// [임시] 테스트 라우트
// GET /api/Lodgings
router.get('/', (req, res) => {
    res.send('Lodgings API 라우터입니다.');
});

// [중요] router 객체를 export 해야 index.js에서 사용할 수 있습니다.
module.exports = router;