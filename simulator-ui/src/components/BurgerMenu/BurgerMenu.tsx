import {LoginButton} from "../LoginButton/LoginButton.tsx";

export interface MenuItem {
    /** Displayed text */
    label: string;
    /** Route path (leaf items only) */
    path?: string;
    /** Children for nested sub‑menus */
    children?: MenuItem[];
}

// --- components/BurgerMenu/BurgerMenu.tsx ---
import { useState } from "react";
import { Link } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import styles from "./BurgerMenu.module.scss";
import type { MenuItem } from "./types";
import {LogoutButton} from "../LogoutButton/LogoutButton.tsx";

interface BurgerMenuProps {
    items: MenuItem[];
}

export function BurgerMenu({ items }: BurgerMenuProps) {
    const [openBurger, setOpenBurger] = useState(false);
    const [openSub, setOpenSub] = useState<string | null>(null);

    const toggleSub = (label: string) =>
        setOpenSub((prev) => (prev === label ? null : label));

    /** Recursively render nested menu items */
    const renderItems = (items: MenuItem[], depth = 0) => {
        return items.map((item) => {
            const hasChildren = item.children && item.children.length > 0;
            const isSubOpen = openSub === item.label;

            return (
                <div key={item.label} className={styles.menuItem} style={{ paddingLeft: depth * 16 }}>
                    {hasChildren ? (
                        <button className={styles.menuButton} onClick={() => toggleSub(item.label)}>
                            {item.label}
                            {isSubOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        </button>
                    ) : (
                        <Link to={item.path!} onClick={() => setOpenBurger(false)}>
                            {item.label}
                        </Link>
                    )}

                    {hasChildren && isSubOpen && (
                        <div className={styles.submenu}>{renderItems(item.children!, depth + 1)}</div>
                    )}
                </div>
            );
        });
    };

    return (
        <>
            {/* Burger toggle */}
            <button className={styles.burgerButton} onClick={() => setOpenBurger(!openBurger)}>
                {openBurger ? <CloseIcon fontSize="large" /> : <MenuIcon fontSize="large" />}
            </button>

            {/* Sliding panel */}
            <nav className={`${styles.menu} ${openBurger ? styles.open : ""}`}>
                {renderItems(items)}
                <LoginButton />
                <br/>
                <LogoutButton />
            </nav>

            {/* Darken page when menu is open */}
            {openBurger && <div className={styles.backdrop} onClick={() => setOpenBurger(false)} />}
        </>
    );
}