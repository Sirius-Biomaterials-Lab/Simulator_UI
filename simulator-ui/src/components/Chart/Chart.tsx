import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { useEffect, useRef, useState } from "react";
import styles from "./Chart.module.scss";
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen';

interface ChartProps {
    name: string;
    x_label: string;
    y_label: string;
    lines: {
        name: string;
        data: {
            x: number[];
            y: number[];
        };
    }[];
}

export function Chart({ name, x_label, y_label, lines }: ChartProps) {
    // ==== Подготовка данных ====
    const [fullscreen, setFullscreen] = useState(false);
    const chartData: Record<string, number>[] = [];
    const maxLength = Math.max(...lines.map((l) => l.data.x.length));
    for (let i = 0; i < maxLength; i++) {
        const point: Record<string, number> = {};
        point["x"] = lines[0].data.x[i];
        lines.forEach((line) => {
            point[line.name] = line.data.y[i];
        });
        chartData.push(point);
    }

    // ==== Состояние позиции легенды ====
    const STORAGE_KEY = `legendPos-${name}`;
    const [legendPos, setLegendPos] = useState(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : { x: 20, y: 20 };
    });

    const containerRef = useRef<HTMLDivElement>(null);
    const legendRef = useRef<HTMLDivElement>(null);
    const dragging = useRef(false);
    const offset = useRef({ x: 0, y: 0 });

    // ==== Drag handlers ====
    const handleMouseDown = (e: React.MouseEvent) => {
        const legendEl = legendRef.current;
        if (!legendEl) return;
        const rect = legendEl.getBoundingClientRect();
        dragging.current = true;
        offset.current = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        };
        e.preventDefault();
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (!dragging.current) return;
        const container = containerRef.current;
        const legendEl = legendRef.current;
        if (!container || !legendEl) return;

        const containerRect = container.getBoundingClientRect();
        const legendRect = legendEl.getBoundingClientRect();

        // Абсолютные координаты курсора
        const absX = e.clientX - offset.current.x;
        const absY = e.clientY - offset.current.y;

        // Ограничиваем по границам контейнера
        const clampedX = Math.max(
            containerRect.left,
            Math.min(absX, containerRect.right - legendRect.width)
        );
        const clampedY = Math.max(
            containerRect.top,
            Math.min(absY, containerRect.bottom - legendRect.height)
        );

        // Относительные внутри контейнера
        const relX = clampedX - containerRect.left;
        const relY = clampedY - containerRect.top;

        const newPos = { x: relX, y: relY };
        setLegendPos(newPos);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newPos));
    };

    const handleMouseUp = () => {
        dragging.current = false;
    };

    useEffect(() => {
        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        };
    }, []);

    useEffect(() => {
        const container = containerRef.current;
        const legend    = legendRef.current;
        if (!container || !legend) return;

        const { width: cw, height: ch } = container.getBoundingClientRect();
        const { width: lw,  height: lh } = legend.getBoundingClientRect();

        // если выходим за пределы — сдвигаем
        const newX = Math.min(legendPos.x, cw - lw);
        const newY = Math.min(legendPos.y, ch - lh);
        if (newX !== legendPos.x || newY !== legendPos.y) {
            const pos = { x: Math.max(0, newX), y: Math.max(0, newY) };
            setLegendPos(pos);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(pos));
        }
    }, [fullscreen, legendPos.x, legendPos.y]);       // ← срабатывает при смене режима


    // ==== Формируем данные легенды ====
    const legendData = lines.map((line, index) => ({
        value: line.name,
        color: `hsl(${(index * 60) % 360}, 70%, 50%)`,
        type: "line",
        id: line.name,
    }));

    // ==== Custom Legend ====
    const CustomLegend = () => (
        <div
            ref={legendRef}
            onMouseDown={handleMouseDown}
            style={{
                position: "absolute",
                left: legendPos.x,
                top: legendPos.y,
                cursor: "move",
                border: "1px solid #ccc",
                borderRadius: "8px",
                background: "#fff",
                padding: "10px",
                zIndex: 2,
                boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
                userSelect: "none",
            }}
        >
            {legendData.map((entry, index) => (
                <div
                    key={`item-${index}`}
                    style={{ display: "flex", alignItems: "center", marginBottom: 6 }}
                >
          <span
              style={{
                  width: 12,
                  height: 12,
                  backgroundColor: entry.color,
                  display: "inline-block",
                  borderRadius: "50%",
                  marginRight: 8,
              }}
          />
                    <span style={{ fontSize: 14 }}>{entry.value}</span>
                </div>
            ))}
        </div>
    );

    // ==== Render ====
    return (
        <div
            className={!fullscreen ? styles.container : styles.fullScreenContainer}
            ref={containerRef}
            style={{ overflow: "visible" }}
        >
            <div style={{display: "flex", alignItems: "center", justifyContent: "space-between"}}>
            <h2 className={styles.title}>{name}</h2>
                <button className={styles.fullScreenButton} onClick={() => setFullscreen(!fullscreen)}>{fullscreen ? <CloseFullscreenIcon /> : <OpenInFullIcon />}</button>
            </div>

            <ResponsiveContainer width="100%" height={fullscreen? '100%':500}>
                <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="x"
                        label={{ value: x_label, position: "insideBottom", offset: -5 }}
                    />
                    <YAxis
                        label={{ value: y_label, angle: -90, position: "insideLeft", offset: 10 }}
                    />
                    <Tooltip />
                    {lines.map((line, index) => (
                        <Line
                            key={line.name}
                            type="monotone"
                            dataKey={line.name}
                            stroke={legendData[index].color}
                            dot={false}
                        />
                    ))}
                </LineChart>
            </ResponsiveContainer>
            {/* Легенда (рядышком поверх графика) */}
            <CustomLegend />

        </div>
    );
}