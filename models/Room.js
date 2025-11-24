const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    // 어느 숙소의 방인가? (부모 연결)
    lodging: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lodging', // Lodging 모델 참조
        required: true,
    },
    // 객실 이름 (예: 디럭스룸, 스탠다드룸)
    name: {
        type: String,
        required: true,
    },
    // 1박 가격
    price: {
        type: Number,
        required: true,
    },
    // 수용 인원
    capacity: {
        type: Number,
        required: true,
        default: 2,
    },
    // 객실 이미지 (선택)
    images: [String],

    // 예약 가능 여부 (관리 차원)
    isAvailable: {
        type: Boolean,
        default: true,
    }
}, { timestamps: true });

// 모델 내보내기 (중복 방지 코드 포함)
module.exports = mongoose.models.Room || mongoose.model('Room', roomSchema);