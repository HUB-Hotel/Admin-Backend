require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db'); // DB 연결 함수 불러오기

// 1. 라우터 파일 불러오기 (수정된 부분)
const authRoutes = require('./routes/auth');
// const roomRoutes = require('./routes/rooms'); // <- 이 줄을 삭제하거나 주석 처리
const accommodationRoutes = require('./routes/accommodations');
const partnerRoutes = require('./routes/partners');

// (나중에 추가할 다른 라우터들...)
// const partnerRoutes = require('./routes/partners'); 
// const userRoutes = require('./routes/users');

// DB 연결 실행
connectDB();

const app = express();

// JSON 파싱 미들웨어
app.use(express.json());

// 2. API 라우터 등록 (수정된 부분)
app.use('/api/auth', authRoutes);
// app.use('/api/rooms', roomRoutes); // <- 이 줄을 삭제하거나 주석 처리
app.use('/api/accommodations', accommodationRoutes); // <- 이 줄을 추가
app.use('/api/partners', partnerRoutes);
// (나중에 추가할 다른 라우터들...)
// app.use('/api/partners', partnerRoutes);
// app.use('/api/users', userRoutes);


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`✅ 서버가 ${PORT}번 포트에서 실행 중입니다.`);
});