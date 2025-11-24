const mongoose = require('mongoose');

const lodgingSchema = new mongoose.Schema({
    // 숙소명
    name: {
        type: String,
        required: [true, '숙소 이름을 입력해주세요.'],
        trim: true,
    },
    // 주소
    address: {
        type: String,
        required: [true, '주소를 입력해주세요.'],
    },
    // 설명
    description: {
        type: String,
    },
    // 카테고리 (호텔, 리조트 등)
    category: {
        type: String,
        required: true,
    },
    // 이미지 URL들
    images: [String],

    // 사업자 정보 (누가 등록했는지)
    business: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Business', // Partner -> Business로 변경됨
        required: true,
    },

    // 편의시설 (선택사항)
    amenities: [String],

}, { timestamps: true });

// 모델 내보내기 (중복 방지 코드 포함)
module.exports = mongoose.models.Lodging || mongoose.model('Lodging', lodgingSchema);