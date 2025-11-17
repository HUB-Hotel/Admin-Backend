// 'authorize' (권한 부여)라는 이름의 미들웨어 함수
// ...roles : 'superadmin', 'manager' 등 여러 개의 역할을 배열로 받습니다.
exports.authorize = (...roles) => {
    return (req, res, next) => {

        // 이 미들웨어는 'protect' 미들웨어 다음에 실행되어야 합니다.
        // 'protect'가 req.admin 객체를 만들어줬다고 가정합니다.
        if (!req.admin) {
            return res.status(500).json({ message: '인증 미들웨어(protect)가 먼저 실행되어야 합니다.' });
        }

        // req.admin.role이 허용된 역할(roles) 목록에 포함되어 있는지 확인
        if (!roles.includes(req.admin.role)) {
            return res.status(403).json({
                message: `접근 거부: 이 기능은 [${roles.join(', ')}] 권한이 필요합니다.`
            });
        }

        // 권한이 있다면 다음 미들웨어(컨트롤러)로 이동
        next();
    };
};