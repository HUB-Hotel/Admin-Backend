const Booking = require('../models/Booking');

// 1. (테스트용) 예약 강제 생성 - Admin Only
exports.createBooking = async (req, res) => {
    try {
        // 실제로는 User 앱에서 결제 후 생성되지만, 테스트를 위해 만듭니다.
        const booking = await Booking.create(req.body);
        res.status(201).json({ message: '예약 생성 성공', booking });
    } catch (error) {
        res.status(500).json({ message: '생성 실패', error: error.message });
    }
};

// 2. 전체 예약 조회 (필터링 포함)
// GET /api/bookings?status=cancelled&userId=...
exports.getAllBookings = async (req, res) => {
    try {
        const { status, userId } = req.query;
        const filter = {};

        if (status) filter.status = status;
        if (userId) filter.user = userId;

        // populate를 사용하면 user, room의 상세 정보까지 한번에 가져옵니다.
        // (지금은 Room/Lodging 데이터가 없어서 에러 날 수 있으니 일단 주석 처리하거나 뺍니다)
        // const bookings = await Booking.find(filter).populate('user', 'name email');

        const bookings = await Booking.find(filter).sort({ createdAt: -1 }); // 최신순
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ message: '서버 오류', error: error.message });
    }
};

// 3. 예약 상태 변경 (취소/확정)
exports.updateBookingStatus = async (req, res) => {
    try {
        const { status } = req.body; // 'cancelled', 'confirmed' 등

        const booking = await Booking.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        if (!booking) {
            return res.status(404).json({ message: '예약을 찾을 수 없습니다.' });
        }

        res.status(200).json({ message: `예약 상태가 ${status}로 변경되었습니다.`, booking });
    } catch (error) {
        res.status(500).json({ message: '서버 오류', error: error.message });
    }
};