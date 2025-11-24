const Lodging = require('../models/Lodging');

// 1. 숙소 등록 (사업자 전용)
exports.createLodging = async (req, res) => {
    try {
        // req.body: 화면에서 입력한 숙소 정보
        // req.user.id: 로그인한 사업자의 ID (authMiddleware에서 옴)

        const newLodging = await Lodging.create({
            ...req.body,
            business: req.user.id // 중요: 누가 등록했는지 기록
        });

        res.status(201).json({
            message: '숙소가 성공적으로 등록되었습니다.',
            lodging: newLodging
        });
    } catch (error) {
        res.status(500).json({ message: '숙소 등록 실패', error: error.message });
    }
};

// 2. 내 숙소 목록 조회 (사업자 전용)
// 로그인한 사업자가 등록한 숙소만 보여줌
exports.getMyLodgings = async (req, res) => {
    try {
        const lodgings = await Lodging.find({ business: req.user.id });
        res.status(200).json(lodgings);
    } catch (error) {
        res.status(500).json({ message: '불러오기 실패', error: error.message });
    }
};

// 3. 전체 숙소 조회 (관리자 전용)
// 플랫폼에 등록된 모든 숙소를 다 보여줌
exports.getAllLodgings = async (req, res) => {
    try {
        const lodgings = await Lodging.find().populate('business', 'name email');
        // populate: 사업자 정보(이름, 이메일)도 같이 가져오기
        res.status(200).json(lodgings);
    } catch (error) {
        res.status(500).json({ message: '서버 오류', error: error.message });
    }
};

// 4. 숙소 상세 조회 (공통)
exports.getLodgingById = async (req, res) => {
    try {
        const lodging = await Lodging.findById(req.params.id);
        if (!lodging) {
            return res.status(404).json({ message: '숙소를 찾을 수 없습니다.' });
        }
        res.status(200).json(lodging);
    } catch (error) {
        res.status(500).json({ message: '서버 오류', error: error.message });
    }
};

// 5. 숙소 수정 (사업자 본인 또는 관리자)
exports.updateLodging = async (req, res) => {
    try {
        const lodging = await Lodging.findByIdAndUpdate(
            req.params.id,
            req.body, // 수정할 내용
            { new: true, runValidators: true } // 업데이트된 최신 데이터 반환
        );

        if (!lodging) {
            return res.status(404).json({ message: '숙소를 찾을 수 없습니다.' });
        }

        res.status(200).json({
            message: '숙소 정보가 수정되었습니다.',
            lodging
        });
    } catch (error) {
        res.status(500).json({ message: '수정 실패', error: error.message });
    }
};

// 6. 숙소 삭제 (선택 사항)
exports.deleteLodging = async (req, res) => {
    try {
        const lodging = await Lodging.findByIdAndDelete(req.params.id);
        if (!lodging) {
            return res.status(404).json({ message: '숙소를 찾을 수 없습니다.' });
        }
        res.status(200).json({ message: '숙소가 삭제되었습니다.' });
    } catch (error) {
        res.status(500).json({ message: '삭제 실패', error: error.message });
    }
};