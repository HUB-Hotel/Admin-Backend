require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db'); // DB 연결 함수 불러오기

// --- 1. 라우터 파일 불러오기 ---
const authRoutes = require('./routes/auth');
const businessRoutes = require('./routes/businesses'); // (수정됨: partners -> businesses)
const lodgingRoutes = require('./routes/lodgings');    // (수정됨: bookings가 아니라 lodgings 파일을 불러와야 함)
const categoryRoutes = require('./routes/categories');
const userRoutes = require('./routes/users');
const bookingRoutes = require('./routes/bookings');
const reviewRoutes = require('./routes/reviews');
const adminRoutes = require('./routes/admins');
const uploadRoutes = require('./routes/upload');
const promotionRoutes = require('./routes/promotions');
const roomRoutes = require('./routes/rooms');

// DB 연결 실행
connectDB();

const app = express();

// JSON 파싱 미들웨어
app.use(express.json());

// --- 2. API 라우터 등록 ---
app.use('/api/auth', authRoutes);
app.use('/api/businesses', businessRoutes); // (수정됨: 오타 businesss -> businesses)
app.use('/api/lodgings', lodgingRoutes);    // (수정됨: URL 대문자 L -> 소문자 l 권장)
app.use('/api/categories', categoryRoutes);
app.use('/api/users', userRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/admins', adminRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/promotions', promotionRoutes);
app.use('/api/rooms', roomRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`✅ 서버가 ${PORT}번 포트에서 실행 중입니다.`);
});