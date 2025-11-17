const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin'); // Admin 모델을 가져옵니다.

const JWT_SECRET = process.env.JWT_SECRET;

// 'protect'라는 이름의 미들웨어 함수
exports.protect = async (req, res, next) => {
    let token;

    // 1. 요청 헤더(Authorization)에 토큰이 있는지 확인
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer') // 'Bearer '로 시작하는 토큰 형식
    ) {
        try {
            // 2. 토큰 추출 ('Bearer ' 부분을 제거)
            token = req.headers.authorization.split(' ')[1];

            // 3. 토큰 검증 (시크릿 키 사용)
            const decoded = jwt.verify(token, JWT_SECRET);

            // 4. 검증 성공 -> 토큰 ID로 DB에서 관리자 정보를 찾아 req 객체에 저장
            // (비밀번호는 제외 '-password')
            req.admin = await Admin.findById(decoded.id).select('-password');

            if (!req.admin) {
                return res.status(401).json({ message: '인증 실패: 사용자를 찾을 수 없습니다.' });
            }

            // 5. 다음 미들웨어(또는 컨트롤러)로 이동
            next();

        } catch (error) {
            console.error(error);
            return res.status(401).json({ message: '인증 실패: 토큰이 유효하지 않습니다.' });
        }
    }

    // 1-1. 토큰이 아예 없는 경우
    if (!token) {
        return res.status(401).json({ message: '인증 실패: 토큰이 없습니다.' });
    }
};