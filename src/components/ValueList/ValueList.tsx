import styles from "./ValueList.module.scss";
import { Tooltip as ReactTooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import React from "react";

interface Item {
    name?: string;
    value?: number | null;
    dimension?: string;
}

interface TooltipProps {
    content: string;
    link: string;
}

interface ValueListProps {
    title?: string;
    items: Item[] | null;
    tooltip?: TooltipProps;
}

export function ValueList({ title, items, tooltip }: ValueListProps) {
    return (
        <div className={styles.container}>
            {title && <h2 className={styles.title}>{title}</h2>}

            <ul className={styles.list}>
                {items?.map((item, index) => (
                    <li key={index} className={styles.item}>
                        {tooltip ? (
                            <>
                <span
                    data-tooltip-id={`tooltip-${index}`}
                    className={styles.name}
                >
                  {item.name}
                </span>
                                <ReactTooltip
                                    id={`tooltip-${index}`}
                                    place="top"
                                    className={styles.tooltipBox}
                                    clickable
                                >
                                    <div className={styles.tooltipContent}>
                                        <div>{tooltip.content}</div>
                                        {tooltip.link && (
                                            <a
                                                href={tooltip.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={styles.tooltipLink}
                                            >
                                                Подробнее
                                            </a>
                                        )}
                                    </div>
                                </ReactTooltip>
                            </>
                        ) : (
                            <span className={styles.name}>{item.name}</span>
                        )}

                        <span className={styles.separator}>:</span>
                        <span className={styles.value}>
              {item.value}
                            {item.dimension && (
                                <span className={styles.dimension}> {item.dimension}</span>
                            )}
            </span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
