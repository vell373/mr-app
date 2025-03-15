import React, { useState, useEffect, useRef } from 'react';
import ConfirmModal from './ConfirmModal';

function RoutineRunner({ routine, onComplete, onCancel }) {
    const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
    const [timeLeft, setTimeLeft] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalAction, setModalAction] = useState(null);
    const [isPaused, setIsPaused] = useState(false);
    const timerIntervalRef = useRef(null);

    // 現在のタスクと次のタスクを取得
    const currentTask = routine.tasks[currentTaskIndex];
    const nextTask = currentTaskIndex < routine.tasks.length - 1 ? routine.tasks[currentTaskIndex + 1] : null;
    const isLastTask = currentTaskIndex === routine.tasks.length - 1;

    // タイマーを開始する関数
    const startTimer = () => {
        if (timerIntervalRef.current !== null) return; // 既に動いている場合は何もしない

        timerIntervalRef.current = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timerIntervalRef.current);
                    timerIntervalRef.current = null;
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    // タイマーを停止する関数
    const stopTimer = () => {
        if (timerIntervalRef.current !== null) {
            clearInterval(timerIntervalRef.current);
            timerIntervalRef.current = null;
        }
    };

    // 一時停止/再開ボタンのハンドラ
    const handlePauseResume = () => {
        if (isPaused) {
            // 再開処理
            startTimer();
        } else {
            // 一時停止処理
            stopTimer();
        }
        setIsPaused(!isPaused);
    };

    // コンポーネントがマウントされたとき、またはタスクが変更されたとき、タイマーを開始
    useEffect(() => {
        if (!currentTask) return;

        setTimeLeft(currentTask.duration * 60); // 分から秒に変換
        setIsPaused(false); // 新しいタスクが始まるときは一時停止状態をリセット
        startTimer();

        // クリーンアップ関数: コンポーネントがアンマウントされたときやタスクが変更されたときにタイマーをクリア
        return () => {
            stopTimer();
        };
    }, [currentTaskIndex, currentTask]);

    // 次のタスクへ移動するための処理
    const handleNext = () => {
        setModalAction('next');
        setIsModalOpen(true);
    };

    // ルーティンを完了するための処理
    const handleComplete = () => {
        setModalAction('complete');
        setIsModalOpen(true);
    };

    // 中止するための処理
    const handleCancel = () => {
        setModalAction('cancel');
        setIsModalOpen(true);
    };

    // モーダルの「はい」ボタンを押したときの処理
    const handleConfirm = () => {
        setIsModalOpen(false);

        if (modalAction === 'next') {
            stopTimer(); // 現在のタイマーを停止
            setCurrentTaskIndex(prev => prev + 1);
        } else if (modalAction === 'complete') {
            stopTimer(); // タイマーを停止
            onComplete();
        } else if (modalAction === 'cancel') {
            stopTimer(); // タイマーを停止
            onCancel();
        }
    };

    // 残り時間を表示用に変換
    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    if (!currentTask) {
        return (
            <div className="routine-runner">
                <h1>ルーティンがありません</h1>
                <button onClick={onCancel}>戻る</button>
            </div>
        );
    }

    return (
        <div className="routine-runner">
            <div className="task-header">
                <h1>{currentTask.name}</h1>
                <p className="task-counter">タスク {currentTaskIndex + 1} / {routine.tasks.length}</p>
            </div>

            <div className="timer">
                <p>残り時間</p>
                <h2>{formatTime(timeLeft)}</h2>
            </div>

            {/* 次のタスク情報を表示 */}
            {nextTask && (
                <div className="next-task-info">
                    <h3>次のタスク</h3>
                    <p>{nextTask.name} ({nextTask.duration}分)</p>
                </div>
            )}

            <div className="task-controls">
                <button onClick={handleCancel} className="cancel-button">中止</button>
                <button onClick={handlePauseResume} className="pause-button">
                    {isPaused ? "再開" : "一時停止"}
                </button>
                {isLastTask ? (
                    <button onClick={handleComplete} className="complete-button">完了</button>
                ) : (
                    <button onClick={handleNext} className="next-button">次へ</button>
                )}
            </div>

            <ConfirmModal
                isOpen={isModalOpen}
                onConfirm={handleConfirm}
                onCancel={() => setIsModalOpen(false)}
                message={
                    modalAction === 'next'
                        ? "次のタスクに進みますか？"
                        : modalAction === 'complete'
                            ? "ルーティンを完了しますか？"
                            : "ルーティンを中止しますか？"
                }
            />
        </div>
    );
}

export default RoutineRunner;