const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');

// .env 파일에서 JWT 시크릿 키 가져오기 (필수!)
const JWT_SECRET = process.env.JWT_SECRET;

// 헬퍼 함수: JWT 토큰 생성
const generateToken = (id, role) => {
    // 토큰에 관리자의 고유 ID와 'role'(권한)을 담습니다.
    return jwt.sign({ id, role }, JWT_SECRET, {
        expiresIn: '1d', // 토큰 유효기간 (예: 1일)
    });
};


// 1. 관리자 계정 생성 (회원가입)
// [주의] 실제 서비스에서는 이 API를 공개하지 않고,
// 슈퍼관리자만 다른 관리자를 생성하도록 만들어야 합니다. (지금은 테스트용)
exports.registerAdmin = async (req, res) => {
    try {
        const { email, password, name, role } = req.body;

        // 1. 이메일 중복 확인
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({ message: '이미 사용 중인 이메일입니다.' });
        }

        // 2. 새 관리자 생성 (비밀번호는 Admin.js의 pre-save 훅에서 자동 암호화됨)
        const admin = new Admin({
            email,
            password,
            name,
            role, // 'staff', 'manager', 'superadmin' 중 하나
        });

        await admin.save();

        // 3. 성공 응답 (토큰은 로그인 시에만 발급)
        res.status(201).json({
            message: '관리자 계정이 성공적으로 생성되었습니다.',
            adminId: admin._id,
            email: admin.email,
        });

    } catch (error) {
        res.status(500).json({ message: '서버 오류가 발생했습니다.', error: error.message });
    }
};


// 2. 관리자 로그인
exports.loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. 이메일로 관리자 찾기
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(401).json({ message: '이메일 또는 비밀번호가 일치하지 않습니다.' });
        }

        // 2. 비밀번호 비교 (Admin.js에서 만든 comparePassword 메서드 사용)
        const isMatch = await admin.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: '이메일 또는 비밀번호가 일치하지 않습니다.' });
        }

        // 3. 비밀번호 일치 -> JWT 토큰 생성
        const token = generateToken(admin._id, admin.role);

        // 4. 토큰과 함께 성공 응답
        res.status(200).json({
            message: '로그인 성공',
            token,
            admin: {
                id: admin._id,
                email: admin.email,
                name: admin.name,
                role: admin.role,
            }
        });

    } catch (error) {
        res.status(500).json({ message: '서버 오류가 발생했습니다.', error: error.message });
    }
};

exports.getMe = async (req, res) => {
    // 'protect' 미들웨어가 성공적으로 실행되면,
    // req 객체에 'admin' 정보가 담기게 됩니다.
    // (authMiddleware.js 18줄 참고)

    // DB에서 찾은 관리자 정보를 그대로 응답으로 보냅니다.
    res.status(200).json(req.admin);
};