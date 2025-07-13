import styles from "./ValueList.module.scss";

interface Item {
    name: string;
    value: number;
    dimension?: string;
}

interface ValueListProps {
    title?: string;
    items: Item[];
}

export function ValueList({ title, items }: ValueListProps) {
    return (
        <div className={styles.container}>
            {title && <h2 className={styles.title}>{title}</h2>}
            <ul className={styles.list}>
                {items.map((item, index) => (
                    <li key={index} className={styles.item}>
                        <span className={styles.name}>{item.name}</span>
                        <span className={styles.separator}>:</span>
                        <span className={styles.value}>
              {item.value}
                            {item.dimension && <span className={styles.dimension}> {item.dimension}</span>}
            </span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
