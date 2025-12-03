import Promotion from './model.js';

// 서비스 1: 프로모션 생성
export const createPromotion = async (data) => {
    const { code } = data;

    // 필수 필드 검증
    if (!data.title) {
        throw new Error('프로모션 제목을 입력해주세요.');
    }
    if (!code) {
        throw new Error('쿠폰 코드를 입력해주세요.');
    }
    if (!data.validUntil) {
        throw new Error('유효 기간을 입력해주세요.');
    }

    // 코드가 있는 경우 중복 체크
    if (code) {
        const exists = await Promotion.findOne({ code });
        if (exists) {
            throw new Error('이미 존재하는 쿠폰 코드입니다.');
        }
    }

    // validUntil을 Date 객체로 변환 (문자열인 경우)
    const promotionData = {
        ...data,
        validUntil: data.validUntil instanceof Date ? data.validUntil : new Date(data.validUntil),
    };

    const promotion = await Promotion.create(promotionData);
    return promotion;
};

// 서비스 2: 목록 조회
export const getAllPromotions = async () => {
    // 최신순 정렬
    const promotions = await Promotion.find().sort({ createdAt: -1 });
    return promotions;
};

// 서비스 3: 상세 조회
export const getPromotionById = async (id) => {
    // MongoDB ObjectId 형식 검증
    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
        throw new Error('유효하지 않은 프로모션 ID입니다.');
    }
    
    const promotion = await Promotion.findById(id);
    if (!promotion) {
        throw new Error('프로모션을 찾을 수 없습니다.');
    }
    return promotion;
};

// 서비스 4: 수정
export const updatePromotion = async (id, data) => {
    // 코드가 변경되는 경우 중복 체크
    if (data.code) {
        const existingPromotion = await Promotion.findOne({ code: data.code });
        if (existingPromotion && existingPromotion._id.toString() !== id) {
            throw new Error('이미 존재하는 쿠폰 코드입니다.');
        }
    }

    // validUntil을 Date 객체로 변환 (문자열인 경우)
    const updateData = { ...data };
    if (updateData.validUntil && !(updateData.validUntil instanceof Date)) {
        updateData.validUntil = new Date(updateData.validUntil);
    }

    const promotion = await Promotion.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
    );
    
    if (!promotion) {
        throw new Error('프로모션을 찾을 수 없습니다.');
    }
    return promotion;
};

// 서비스 5: 상태 업데이트
export const updatePromotionStatus = async (id, isActive) => {
    const promotion = await Promotion.findByIdAndUpdate(
        id,
        { isActive },
        { new: true }
    );
    
    if (!promotion) {
        throw new Error('프로모션을 찾을 수 없습니다.');
    }
    return promotion;
};

// 서비스 6: 삭제
export const deletePromotion = async (id) => {
    const promotion = await Promotion.findByIdAndDelete(id);
    if (!promotion) {
        throw new Error('프로모션을 찾을 수 없습니다.');
    }
    return promotion;
};