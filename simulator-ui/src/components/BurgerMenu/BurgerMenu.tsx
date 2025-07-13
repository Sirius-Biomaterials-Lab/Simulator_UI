import { useState } from "react";
import { Link } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import styles from "./BurgerMenu.module.scss";

interface MenuItem {
    path: string;
    label: string;
}

interface BurgerMenuProps {
    items: MenuItem[];
}

export function BurgerMenu({ items }: BurgerMenuProps) {
    const [open, setOpen] = useState(false);

    return (
        <>
            <button className={styles.burgerButton} onClick={() => setOpen(!open)}>
                {open ? <CloseIcon fontSize="large" /> : <MenuIcon fontSize="large" />}
            </button>

            <div className={`${styles.menu} ${open ? styles.open : ""}`}>
                {items.map(({ path, label }) => (
                    <Link key={path} to={path} onClick={() => setOpen(false)}>
                        {label}
                    </Link>
                ))}
            </div>

            {open && <div className={styles.backdrop} onClick={() => setOpen(false)} />}
        </>
    );
}
