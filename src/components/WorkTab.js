import React, { useState, useEffect } from 'react';

// 応援メッセージの配列
const encouragingMessages = [
    "今日も素晴らしい一日になりますように！",
    "良い朝のルーティンが良い一日を作ります！",
    "今日の積み重ねが明日の自分を作ります！",
    "小さな一歩が大きな変化を生み出します！",
    "今日という日を大切に過ごしましょう！",
    "朝の習慣が人生を変えます！",
    "今日もベストを尽くしましょう！",
    "毎日のルーティンが人生の質を高めます！",
    "一日の始まりを大切にしましょう！",
    "継続は力なり！頑張りましょう！"
];

function WorkTab({ onStart, routine }) {
    // ルーティンが設定されているかチェック
    const hasRoutine = routine && routine.tasks && routine.tasks.length > 0;

    // ランダムメッセージ用のstate
    const [message, setMessage] = useState("");

    // コンポーネントマウント時にランダムメッセージを設定
    useEffect(() => {
        const randomIndex = Math.floor(Math.random() * encouragingMessages.length);
        setMessage(encouragingMessages[randomIndex]);
    }, []);

    return (
        <div className="work-tab">
            <h1>モーニングルーティン</h1>

            {hasRoutine ? (
                <>
                    <div className="routine-info">
                        <p><strong>開始時間:</strong> {routine.startTime}</p>
                        <p><strong>タスク数:</strong> {routine.tasks.length}</p>
                        <p><strong>合計時間:</strong> {routine.tasks.reduce((total, task) => total + task.duration, 0)}分</p>
                    </div>
                    <button className="start-button" onClick={onStart}>
                        <span className="material-icons">play_arrow</span>
                    </button>
                    <div className="encouraging-message">
                        {message}
                    </div>
                </>
            ) : (
                <div className="no-routine">
                    <p>モーニングルーティンが設定されていません</p>
                    <p>「ルーティン」タブで設定してください</p>
                </div>
            )}
        </div>
    );
}

export default WorkTab;
