import React from "react";
import { Link, useLocation } from "react-router-dom";

function FlyoutMenu({ menu, position, onMouseEnter, onMouseLeave }) {
    const location = useLocation();

    if (!menu || !menu.submenu) return null;

    const isLinkActive = (path) => {
        return location.pathname + location.search === path;
    };

    const style = position 
        ? { top: `${position.top}px`, bottom: "auto" }
        : { top: 0, bottom: "auto" };

    return (
        <div 
            className="sidebar-flyout-panel fade-in"
            style={style}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            <div className="flyout-header">
                <span className="flyout-title">{menu.label}</span>
            </div>
            
            <ul className="flyout-list">
                {menu.submenu.map((item, idx) => {
                    const isActive = isLinkActive(item.path);
                    return (
                        <li key={idx}>
                            <Link 
                                to={item.path} 
                                className={`flyout-link ${isActive ? "active" : ""}`}
                            >
                                <span className="flyout-bullet"></span>
                                <span className="flyout-label">{item.label}</span>
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}

export default FlyoutMenu;
