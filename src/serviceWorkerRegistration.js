// serviceWorkerRegistration.js
export function register() {
    if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
        const publicUrl = new URL(process.env.PUBLIC_URL, window.location.href);
        if (publicUrl.origin !== window.location.origin) {
            return;
        }

        window.addEventListener('load', () => {
            const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;
            registerValidSW(swUrl);
        });
    }
}

function registerValidSW(swUrl) {
    navigator.serviceWorker
        .register(swUrl)
        .then(registration => {
            registration.onupdatefound = () => {
                const installingWorker = registration.installing;
                if (installingWorker == null) {
                    return;
                }
                installingWorker.onstatechange = () => {
                    if (installingWorker.state === 'installed') {
                        if (navigator.serviceWorker.controller) {
                            console.log('新しいコンテンツが利用可能です。更新してください。');
                        } else {
                            console.log('コンテンツをオフラインで利用できるようにキャッシュしました。');
                        }
                    }
                };
            };
        })
        .catch(error => {
            console.error('Service Workerの登録中にエラーが発生しました:', error);
        });
}

export function unregister() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready
            .then(registration => {
                registration.unregister();
            })
            .catch(error => {
                console.error(error.message);
            });
    }
}