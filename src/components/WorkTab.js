import React from 'react';

function WorkTab({ onStart, routine }) {
    // ルーティンが設定されているかチェック
    const hasRoutine = routine && routine.tasks && routine.tasks.length > 0;

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
                        スタート
                    </button>
                </>
            ) : (
                <div className="no-routine">
                    <p>モーニングルーティンが設定されていません</p>
                    <p>「ルーティン設定」タブで設定してください</p>
                </div>
            )}
        </div>
    );
}

export default WorkTab;
