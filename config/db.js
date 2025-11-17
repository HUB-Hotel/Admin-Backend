const mongoose = require('mongoose');

// .env 파일에서 MONGODB_URI 환경 변수를 가져옵니다.
const dbURI = process.env.MONGODB_URI;

const connectDB = async () => {
    try {
        // Mongoose로 MongoDB에 연결 시도
        await mongoose.connect(dbURI);

        console.log('✅ MongoDB가 성공적으로 연결되었습니다.');

    } catch (err) {
        console.error('❌ MongoDB 연결 실패:', err.message);

        // 연결 실패 시 서버 프로세스 종료
        process.exit(1);
    }
};

module.exports = connectDB;