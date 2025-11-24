const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    // 1. 누가, 어떤 예약에 대해 썼는지
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    booking: { // 예약 정보와 연결 (1개 예약당 1개 리뷰)
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking',
        required: true,
    },
    Lodging: { // 어떤 숙소인지 (검색 편의성)
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lodging',
        required: true,
    },

    // 2. 리뷰 내용
    rating: {
        type: Number,
        required: [true, '평점을 입력해주세요 (1~5).'],
        min: 1,
        max: 5,
    },
    content: {
        type: String,
        required: [true, '리뷰 내용을 입력해주세요.'],
        trim: true,
    },

    // 3. [핵심] 관리자 제어 필드
    // 관리자가 false로 바꾸면 앱에서 안 보이게 처리
    isVisible: {
        type: Boolean,
        default: true,
    },

    // 관리자가 숨김 처리한 이유 (메모)
    adminComment: {
        type: String,
        default: '',
    }
}, {
    timestamps: true
});

// 한 예약당 리뷰는 하나만 쓸 수 있게 유니크 인덱스 설정 (선택사항)
// reviewSchema.index({ booking: 1 }, { unique: true });

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;