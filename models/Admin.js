const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const adminSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, '이메일을 입력해주세요.'],
        unique: true, // 이메일은 중복될 수 없습니다.
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: [true, '비밀번호를 입력해주세요.'],
        minlength: [6, '비밀번호는 6자리 이상이어야 합니다.'],
    },
    role: {
        type: String,
        enum: ['admin', 'staff'], // ⭐️ 'superadmin', 'manager' -> 'admin', 'staff'로 변경
        default: 'staff', // ⭐️ 기본값은 'staff'
    },
    name: {
        type: String,
        required: [true, '이름을 입력해주세요.'],
        trim: true,
    }
}, {
    // timestamps: true 옵션은 createdAt과 updatedAt 필드를 자동으로 추가합니다.
    timestamps: true
});

// [중요] Mongoose의 'pre-save' 미들웨어 (Hook) 사용
// 이 스키마를 'save' (저장)하기 "전에" 이 함수를 실행합니다.
adminSchema.pre('save', async function (next) {
    // 'this'는 저장될 Admin 문서를 가리킵니다.

    // 비밀번호가 변경되었거나, 새로 생성될 때만 암호화를 실행합니다.
    if (!this.isModified('password')) {
        return next(); // 비밀번호 변경이 아니면 다음 미들웨어로 넘어갑니다.
    }

    try {
        // 1. Salt 생성 (암호화 복잡도)
        const salt = await bcrypt.genSalt(10); // 10 정도가 적당

        // 2. 비밀번호와 Salt를 이용해 해시(Hash) 생성
        this.password = await bcrypt.hash(this.password, salt);

        next(); // 다음 로직으로 진행
    } catch (error) {
        next(error); // 에러 발생 시
    }
});

// [추가] 비밀번호 비교 메서드 (로그인 시 사용)
// 이 Admin 문서의 비밀번호와, 사용자가 입력한 비밀번호를 비교합니다.
adminSchema.methods.comparePassword = async function (inputPassword) {
    try {
        return await bcrypt.compare(inputPassword, this.password);
    } catch (error) {
        return false;
    }
};


// Admin 모델 생성 및 export
const Admin = mongoose.model('Admin', adminSchema);
module.exports = Admin;