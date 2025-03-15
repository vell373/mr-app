import React, { useState } from 'react';
// react-iconsからゴミ箱アイコンをインポート
import { FaTrash, FaArrowUp, FaArrowDown } from 'react-icons/fa';

function RoutineTab({ routine, setRoutine }) {
    const [startTime, setStartTime] = useState(routine.startTime);
    const [newTaskName, setNewTaskName] = useState('');
    const [newTaskDuration, setNewTaskDuration] = useState('');

    // 保存ボタンを押したときの処理
    const handleSave = () => {
        setRoutine({
            ...routine,
            startTime: startTime
        });
        alert('ルーティンを保存しました');
    };

    // タスクを追加する処理
    const addTask = () => {
        if (!newTaskName || !newTaskDuration) {
            alert('タスク名と時間を入力してください');
            return;
        }

        const duration = parseInt(newTaskDuration);
        if (isNaN(duration) || duration <= 0) {
            alert('有効な時間を入力してください');
            return;
        }

        setRoutine({
            ...routine,
            tasks: [
                ...routine.tasks,
                { name: newTaskName, duration: duration }
            ]
        });

        // 入力フィールドをクリア
        setNewTaskName('');
        setNewTaskDuration('');
    };

    // タスクを削除する処理
    const removeTask = (index) => {
        const newTasks = [...routine.tasks];
        newTasks.splice(index, 1);
        setRoutine({
            ...routine,
            tasks: newTasks
        });
    };

    // タスクを上に移動
    const moveTaskUp = (index) => {
        if (index === 0) return;
        const newTasks = [...routine.tasks];
        [newTasks[index - 1], newTasks[index]] = [newTasks[index], newTasks[index - 1]];
        setRoutine({
            ...routine,
            tasks: newTasks
        });
    };

    // タスクを下に移動
    const moveTaskDown = (index) => {
        if (index === routine.tasks.length - 1) return;
        const newTasks = [...routine.tasks];
        [newTasks[index], newTasks[index + 1]] = [newTasks[index + 1], newTasks[index]];
        setRoutine({
            ...routine,
            tasks: newTasks
        });
    };

    // タスクの時間を更新
    const updateTaskDuration = (index, newDuration) => {
        const duration = parseInt(newDuration);
        if (isNaN(duration) || duration <= 0) return;

        const newTasks = [...routine.tasks];
        newTasks[index].duration = duration;
        setRoutine({
            ...routine,
            tasks: newTasks
        });
    };

    return (
        <div className="routine-tab">
            <h1>モーニングルーティン設定</h1>

            <div className="setting-section">
                <h2>開始時間</h2>
                <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                />
            </div>

            <div className="setting-section">
                <h2>ルーティンタスク</h2>

                <div className="task-list">
                    {routine.tasks.map((task, index) => (
                        <div key={index} className="task-item">
                            <div className="task-info">
                                <span>{task.name}</span>
                                <input
                                    type="number"
                                    value={task.duration}
                                    onChange={(e) => updateTaskDuration(index, e.target.value)}
                                    min="1"
                                    className="duration-input"
                                /> 分
                            </div>
                            <div className="task-actions">
                                <button onClick={() => moveTaskUp(index)} disabled={index === 0}>
                                    <FaArrowUp />
                                </button>
                                <button onClick={() => moveTaskDown(index)} disabled={index === routine.tasks.length - 1}>
                                    <FaArrowDown />
                                </button>
                                {/* ここを変更: テキストをアイコンに置き換え */}
                                <button onClick={() => removeTask(index)} className="delete-button">
                                    <FaTrash />
                                </button>
                            </div>
                        </div>
                    ))}

                    {routine.tasks.length === 0 && (
                        <p>タスクがありません。タスクを追加してください。</p>
                    )}
                </div>

                <div className="add-task">
                    <input
                        type="text"
                        placeholder="タスク名"
                        value={newTaskName}
                        onChange={(e) => setNewTaskName(e.target.value)}
                    />
                    <input
                        type="number"
                        placeholder="時間（分）"
                        value={newTaskDuration}
                        onChange={(e) => setNewTaskDuration(e.target.value)}
                        min="1"
                    />
                    <button onClick={addTask}>追加</button>
                </div>
            </div>

            <button className="save-button" onClick={handleSave}>
                ルーティンを保存
            </button>
        </div>
    );
}

export default RoutineTab;
