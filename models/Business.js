const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const businessSchema = new mongoose.Schema({
    // 1. 파트너 계정 정보 (파트너 대시보드 로그인용)
    email: {
        type: String,
        required: [true, '이메일을 입력해주세요.'],
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: [true, '비밀번호를 입력해주세요.'],
        minlength: 6,
    },
    name: { // 담당자 이름
        type: String,
        required: [true, '담당자 이름을 입력해주세요.'],
        trim: true,
    },

    // 2. 사업자 정보 (관리자가 검토할 내용)
    companyName: { // 상호명
        type: String,
        required: [true, '상호명을 입력해주세요.'],
    },
    businessNumber: { // 사업자 등록번호
        type: String,
        required: [true, '사업자 등록번호를 입력해주세요.'],
        unique: true,
    },
    phoneNumber: {
        type: String,
        required: [true, '연락처를 입력해주세요.'],
    },

    // 3. [핵심] 관리자 승인 상태
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'suspended'], // 승인대기, 승인됨, 거절됨, 정지됨
        default: 'pending', // 사업자가 가입 신청 시 기본값은 'pending'
    },

    adminNotes: { // 관리자가 남기는 메모 (거절 사유, 특이사항 등)
        type: String,
        trim: true,
    }
}, {
    timestamps: true // createdAt, updatedAt 자동 생성
});

// Admin 모델과 동일하게, business 계정 생성 시 비밀번호 암호화
businessSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// business 로그인 시 비밀번호 비교 메서드
businessSchema.methods.comparePassword = async function (inputPassword) {
    return await bcrypt.compare(inputPassword, this.password);
};

const Business = mongoose.models.Business || mongoose.model('Business', businessSchema);

module.exports = Business;