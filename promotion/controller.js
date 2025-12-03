import * as promotionService from './service.js';
import { successResponse, errorResponse } from '../common/response.js';

// 1. 프로모션 생성
export const createPromotion = async (req, res) => {
    try {
        const promotion = await promotionService.createPromotion(req.body);

        res.status(201).json(successResponse(promotion, "프로모션 생성 성공", 201));
    } catch (error) {
        // 중복 에러는 400, 그 외는 500
        const statusCode = error.message.includes('이미 존재') ? 400 : 500;
        res.status(statusCode).json(errorResponse(error.message, statusCode));
    }
};

// 2. 목록 조회
export const getAllPromotions = async (req, res) => {
    try {
        const promotions = await promotionService.getAllPromotions();
        res.status(200).json(successResponse(promotions, "프로모션 목록 조회 성공"));
    } catch (error) {
        res.status(500).json(errorResponse(error.message, 500));
    }
};

// 3. 상세 조회
export const getPromotionById = async (req, res) => {
    try {
        console.log('📥 프로모션 상세 조회 요청:', req.params.id);
        const promotion = await promotionService.getPromotionById(req.params.id);
        console.log('✅ 프로모션 조회 성공:', promotion._id);
        res.status(200).json(successResponse(promotion, "프로모션 상세 조회 성공"));
    } catch (error) {
        console.error('❌ 프로모션 조회 에러:', error.message);
        res.status(404).json(errorResponse(error.message, 404));
    }
};

// 4. 수정
export const updatePromotion = async (req, res) => {
    try {
        const promotion = await promotionService.updatePromotion(req.params.id, req.body);
        res.status(200).json(successResponse(promotion, "프로모션이 수정되었습니다."));
    } catch (error) {
        const statusCode = error.message.includes('이미 존재') || error.message.includes('찾을 수 없습니다') ? 400 : 500;
        res.status(statusCode).json(errorResponse(error.message, statusCode));
    }
};

// 5. 상태 업데이트
export const updatePromotionStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const isActive = status === 'active' || status === true;
        const promotion = await promotionService.updatePromotionStatus(req.params.id, isActive);
        res.status(200).json(successResponse(promotion, "프로모션 상태가 변경되었습니다."));
    } catch (error) {
        res.status(404).json(errorResponse(error.message, 404));
    }
};

// 6. 삭제
export const deletePromotion = async (req, res) => {
    try {
        await promotionService.deletePromotion(req.params.id);
        res.status(200).json(successResponse(null, "프로모션이 삭제되었습니다."));
    } catch (error) {
        res.status(404).json(errorResponse(error.message, 404));
    }
};