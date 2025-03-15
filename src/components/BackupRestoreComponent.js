// BackupRestoreComponent.js
import React, { useRef } from 'react';

function BackupRestoreComponent() {
    const fileInputRef = useRef(null);

    // データエクスポート関数
    const exportData = () => {
        try {
            // ローカルストレージから全てのデータを取得
            const routine = JSON.parse(localStorage.getItem('morningRoutine'));
            const stats = JSON.parse(localStorage.getItem('completionStats'));

            // データをまとめる
            const data = {
                routine: routine,
                stats: stats,
                exportDate: new Date().toISOString()
            };

            // JSONファイルとしてエクスポート
            const jsonString = JSON.stringify(data, null, 2);
            const blob = new Blob([jsonString], { type: 'application/json' });
            const url = URL.createObjectURL(blob);

            // ダウンロードリンクを作成
            const a = document.createElement('a');
            a.href = url;
            a.download = `morning-routine-backup-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();

            // クリーンアップ
            URL.revokeObjectURL(url);
            document.body.removeChild(a);

            alert('バックアップを作成しました。ダウンロードしたファイルは安全な場所に保管してください。');
        } catch (error) {
            console.error('バックアップの作成に失敗しました:', error);
            alert('バックアップの作成に失敗しました。');
        }
    };

    // データインポート関数
    const importData = (event) => {
        try {
            const file = event.target.files[0];
            if (!file) return;

            const reader = new FileReader();

            reader.onload = (e) => {
                try {
                    // ファイルの内容をJSONとしてパース
                    const data = JSON.parse(e.target.result);

                    // データの検証
                    if (!data.routine || !data.stats) {
                        alert('バックアップファイルの形式が正しくありません。');
                        return;
                    }

                    // ローカルストレージにデータを復元
                    localStorage.setItem('morningRoutine', JSON.stringify(data.routine));
                    localStorage.setItem('completionStats', JSON.stringify(data.stats));

                    alert('データを復元しました。画面を更新します。');
                    window.location.reload();
                } catch (error) {
                    console.error('ファイルの解析に失敗しました:', error);
                    alert('バックアップファイルの解析に失敗しました。');
                }
            };

            reader.onerror = () => {
                alert('ファイルの読み込みに失敗しました。');
            };

            reader.readAsText(file);
        } catch (error) {
            console.error('データのインポートに失敗しました:', error);
            alert('データのインポートに失敗しました。');
        }
    };

    const handleImportClick = () => {
        // ファイル選択ダイアログを表示
        fileInputRef.current.click();
    };

    return (
        <div className="backup-restore-container">
            <div className="backup-section">
                <p>ルーティン設定と達成記録をバックアップします。ブラウザキャッシュのクリアや端末の変更時に備えて定期的にバックアップを作成することをお勧めします。</p>
                <button
                    className="backup-button"
                    onClick={exportData}
                >
                    データをバックアップ
                </button>
            </div>

            <div className="restore-section">
                <p>バックアップからデータを復元します。現在のデータは上書きされますのでご注意ください。</p>
                <button
                    className="restore-button"
                    onClick={handleImportClick}
                >
                    バックアップから復元
                </button>
                <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    accept=".json"
                    onChange={importData}
                />
            </div>
        </div>
    );
}

export default BackupRestoreComponent;