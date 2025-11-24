const Room = require('../models/Room');
const Lodging = require('../models/Lodging');

// 1. 객실 생성 (사업자용)
exports.createRoom = async (req, res) => {
    try {
        const { lodgingId, name, price, capacity } = req.body;

        // 숙소가 존재하는지 확인
        const lodging = await Lodging.findById(lodgingId);
        if (!lodging) {
            return res.status(404).json({ message: '숙소를 찾을 수 없습니다.' });
        }

        // 객실 생성
        const room = await Room.create({
            lodging: lodgingId,
            name,
            price,
            capacity
        });

        res.status(201).json({ message: '객실 생성 성공', room });
    } catch (error) {
        res.status(500).json({ message: '객실 생성 실패', error: error.message });
    }
};

// 2. 특정 숙소의 객실 목록 조회 (사용자/사업자 공용)
// URL: /api/lodgings/:id/rooms 로 호출될 예정
exports.getRoomsByLodgingId = async (req, res) => {
    try {
        // URL의 :id 파라미터가 Lodging ID라고 가정
        const rooms = await Room.find({ lodging: req.params.id });
        res.status(200).json(rooms);
    } catch (error) {
        res.status(500).json({ message: '불러오기 실패', error: error.message });
    }
};

// 3. 객실 수정 (사업자용)
exports.updateRoom = async (req, res) => {
    try {
        const room = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!room) return res.status(404).json({ message: '객실을 찾을 수 없습니다.' });
        res.status(200).json({ message: '수정 성공', room });
    } catch (error) {
        res.status(500).json({ message: '수정 실패', error: error.message });
    }
};

// 4. 객실 삭제 (사업자용)
exports.deleteRoom = async (req, res) => {
    try {
        const room = await Room.findByIdAndDelete(req.params.id);
        if (!room) return res.status(404).json({ message: '객실을 찾을 수 없습니다.' });
        res.status(200).json({ message: '삭제 성공' });
    } catch (error) {
        res.status(500).json({ message: '삭제 실패', error: error.message });
    }
};