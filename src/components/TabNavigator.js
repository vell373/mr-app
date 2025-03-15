import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';

function TabNavigator() {
    const location = useLocation();

    return (
        <div className="tab-navigator">
            <NavLink to="/" className={location.pathname === '/' ? 'active' : ''}>
                ワーク
            </NavLink>
            <NavLink to="/routine" className={location.pathname === '/routine' ? 'active' : ''}>
                ルーティン
            </NavLink>
            <NavLink to="/calendar" className={location.pathname === '/calendar' ? 'active' : ''}>
                カレンダー
            </NavLink>
        </div>
    );
}

export default TabNavigator;
