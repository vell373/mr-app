import React from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { FaTrophy, FaFire, FaMedal } from 'react-icons/fa';

function CalendarTab({ completionStats }) {
    const { record, totalDays, currentStreak, longestStreak } = completionStats;
    const isBreakingRecord = currentStreak >= longestStreak && currentStreak > 0;

    // 日付判定などの関数は変更なし
    const isCompleted = (date) => {
        const dateString = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        return record[dateString];
    };

    const tileClassName = ({ date, view }) => {
        if (view === 'month') {
            if (isCompleted(date)) {
                return 'completed-day';
            }
            const today = new Date();
            if (date.getDate() === today.getDate() &&
                date.getMonth() === today.getMonth() &&
                date.getFullYear() === today.getFullYear()) {
                return 'today-highlight';
            }
        }
        return null;
    };

    const tileContent = ({ date, view }) => {
        if (view === 'month' && isCompleted(date)) {
            return <div className="completion-stamp">✓</div>;
        }
        return null;
    };

    return (
        <div className="calendar-tab compact-layout">
            <h1>記録</h1>

            <div className="stats-cards">
                <div className="stat-card total-days sct">
                    <div className="stat-icon-container">
                        <FaTrophy className="stat-icon-trophy" />
                        <div className="stat-content">
                            <h3>合計達成日数</h3>
                            <div className="stat-value">{totalDays}日</div>
                        </div>
                    </div>
                </div>

                <div className="stat-card streak">
                    <div className="stat-icon-container">
                        <FaFire className="stat-icon-fire" />
                        <div className="stat-content">
                            <h3>連続達成日数</h3>
                            <div className="stat-value">{currentStreak}日</div>
                        </div>
                    </div>
                </div>

                <div className="stat-card best-streak sct">
                    <div className="stat-icon-container">
                        <FaMedal className="stat-icon-medal" />
                        <div className="stat-content">
                            <h3>最長連続記録</h3>
                            <div className="stat-value">{longestStreak}日</div>
                        </div>
                    </div>
                    {isBreakingRecord && <div className="record-badge">記録更新中！</div>}
                </div>
            </div>

            <div className="calendar-container-compact">
                <Calendar
                    tileClassName={tileClassName}
                    tileContent={tileContent}
                    locale="ja-JP"
                    view="month"
                />
            </div>
        </div>
    );
}

export default CalendarTab;
