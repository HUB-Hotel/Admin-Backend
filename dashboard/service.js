// 다른 도메인의 모델들을 불러옵니다. (확장자 .js 필수!)
import User from '../user/model.js';
import Business from '../business/model.js';
import Review from '../review/model.js';

// 서비스: 대시보드 통계 데이터 조회
export const getStats = async () => {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const yearStart = new Date(now.getFullYear(), 0, 1);

    // Promise.all을 사용하여 병렬로 실행
    const [
        userCount,
        pendingBusinessCount,
        reviewCount
    ] = await Promise.all([
        User.countDocuments(),
        Business.countDocuments({ status: 'pending' }),
        Review.countDocuments()
    ]);

    // Booking 모델이 제거되었으므로 매출 및 예약 관련 통계는 0으로 설정
    const totalRevenue = 0;
    const todayRevenue = 0;
    const monthRevenue = 0;
    const yearRevenue = 0;
    const todayBookings = 0;
    const monthBookings = 0;
    const yearBookings = 0;
    const todayChange = 0;
    const monthChange = 0;
    const yearChange = 0;

    return {
        totalRevenue,
        today: {
            revenue: todayRevenue,
            bookings: todayBookings,
            change: {
                revenue: todayChange,
                bookings: 0
            }
        },
        thisMonth: {
            revenue: monthRevenue,
            bookings: monthBookings,
            change: {
                revenue: monthChange,
                bookings: 0
            }
        },
        thisYear: {
            revenue: yearRevenue,
            bookings: yearBookings,
            change: {
                revenue: yearChange,
                bookings: 0
            }
        },
        // 기존 카운트 데이터도 포함 (필요시 사용)
        userCount,
        pendingBusinessCount,
        bookingCount: 0, // Booking 모델이 제거되어 0으로 설정
        reviewCount
    };
};