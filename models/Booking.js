const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    // 1. 예약자 정보 (User 모델 참조)
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },

    // 2. 숙소 및 객실 정보 (나중에 Lodging, Room 모델 참조)
    Lodging: { // 어느 호텔인지 (검색 편의성)
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lodging',
        required: true,
    },
    room: { // 어떤 객실인지
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room',
        required: true,
    },

    // 3. 예약 일정 및 금액
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
    totalPrice: { type: Number, required: true },
    guestCount: { type: Number, default: 2 },

    // 4. 예약 상태 (관리자가 제어할 핵심 필드)
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled', 'completed'],
        default: 'pending', // 대기 -> 확정 -> (취소) -> 완료
    },

    // 결제 상태
    paymentStatus: {
        type: String,
        enum: ['unpaid', 'paid', 'refunded'],
        default: 'unpaid',
    }
}, {
    timestamps: true
});

const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;