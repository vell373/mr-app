import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import TabNavigator from './components/TabNavigator';
import WorkTab from './components/WorkTab';
import RoutineTab from './components/RoutineTab';
import CalendarTab from './components/CalendarTab';
import RoutineRunner from './components/RoutineRunner';
import './styles.css';

function App() {
  // モーニングルーティンの状態
  const [routine, setRoutine] = useState(() => {
    const savedRoutine = localStorage.getItem('morningRoutine');
    return savedRoutine ? JSON.parse(savedRoutine) : {
      startTime: '06:00',
      tasks: []
    };
  });

  // ルーティン実行状態
  const [isRunning, setIsRunning] = useState(false);

  // 完了記録の状態を拡張 - 単純なオブジェクトから詳細な統計情報を含む形式に
  const [completionStats, setCompletionStats] = useState(() => {
    const savedStats = localStorage.getItem('completionStats');
    return savedStats ? JSON.parse(savedStats) : {
      record: {},  // 完了記録
      totalDays: 0,  // 合計達成日数
      currentStreak: 0,  // 現在の連続達成日数
      longestStreak: 0   // 最長連続達成日数
    };
  });

  // ルーティンが変更されたらローカルストレージに保存
  useEffect(() => {
    localStorage.setItem('morningRoutine', JSON.stringify(routine));
  }, [routine]);

  // 完了統計が変更されたらローカルストレージに保存
  useEffect(() => {
    localStorage.setItem('completionStats', JSON.stringify(completionStats));
  }, [completionStats]);

  // ルーティン完了時の処理を強化
  const handleRoutineComplete = () => {
    // 日本時間での現在の日付を取得
    const now = new Date();
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

    // 既に今日の記録があれば処理しない（二重記録防止）
    if (completionStats.record[today]) {
      setIsRunning(false);
      return;
    }

    // 昨日の日付を計算
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayString = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;

    // 連続日数の計算
    // 昨日も達成していれば連続日数を増やし、そうでなければ1にリセット
    let newStreak = completionStats.record[yesterdayString] ? completionStats.currentStreak + 1 : 1;

    // 最長連続記録を更新
    const newLongestStreak = Math.max(newStreak, completionStats.longestStreak);

    // 統計情報を更新
    setCompletionStats(prev => ({
      ...prev,
      record: { ...prev.record, [today]: true }, // 今日の達成を記録
      totalDays: prev.totalDays + 1,            // 合計日数を増加
      currentStreak: newStreak,                 // 現在の連続日数を更新
      longestStreak: newLongestStreak          // 必要に応じて最長記録を更新
    }));

    setIsRunning(false);
  };

  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // オンライン/オフラインステータスの監視
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <Router>
      <div className="app">
        {!isOnline && (
          <div className="offline-notification">
            現在オフラインモードで動作しています
          </div>
        )}
        {isRunning ? (
          <RoutineRunner
            routine={routine}
            onComplete={handleRoutineComplete}
            onCancel={() => setIsRunning(false)}
          />
        ) : (
          <>
            <div className="content">
              <Routes>
                <Route path="/" element={<WorkTab onStart={() => setIsRunning(true)} routine={routine} />} />
                <Route path="/routine" element={<RoutineTab routine={routine} setRoutine={setRoutine} />} />
                <Route path="/calendar" element={<CalendarTab completionStats={completionStats} />} />
              </Routes>
            </div>
            <TabNavigator />
          </>
        )}
      </div>
    </Router>
  );
}

export default App;