import { useEffect, useRef, useState } from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import CloseFullscreenIcon from "@mui/icons-material/CloseFullscreen";
import styles from "./Chart.module.scss";

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

type LegendPos = { x: number; y: number };

export function Chart({ name, x_label, y_label, lines }: ChartProps) {
    // ==== Полноэкранный режим ====
    const [fullscreen, setFullscreen] = useState(false);

    // ==== Подготовка данных ====
    // Строим объединённый набор точек по всем сериям
    // Ключ — X; значения — объект { x, [seriesName]: y }
    const map = new Map<number, Record<string, number | undefined>>();

    for (const line of lines) {
        const xs = line.data.x;
        const ys = line.data.y;
        const len = Math.min(xs.length, ys.length);

        for (let i = 0; i < len; i++) {
            const x = xs[i];
            const y = ys[i];
            if (x == null || y == null) continue;

            if (!map.has(x)) map.set(x, { x });
            const row = map.get(x)!;
            row[line.name] = y;
        }
    }

    const chartData: Array<Record<string, number | undefined>> = Array.from(
        map.values()
    ).sort((a, b) => (a.x as number) - (b.x as number));

    // ==== Состояние позиции легенды (drag + сохранение) ====
    const STORAGE_KEY = `legendPos-${name}`;
    const [legendPos, setLegendPos] = useState<LegendPos>(() => {
        try {
            const saved =
                typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
            return saved ? JSON.parse(saved) : { x: 20, y: 20 };
        } catch {
            return { x: 20, y: 20 };
        }
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

        const newPos: LegendPos = { x: relX, y: relY };
        setLegendPos(newPos);
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newPos));
        } catch {}
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // При смене размеров (в т.ч. фуллскрин) не даём легенде «выпасть» за границы
    useEffect(() => {
        const container = containerRef.current;
        const legend = legendRef.current;
        if (!container || !legend) return;

        const { width: cw, height: ch } = container.getBoundingClientRect();
        const { width: lw, height: lh } = legend.getBoundingClientRect();

        const newX = Math.min(legendPos.x, cw - lw);
        const newY = Math.min(legendPos.y, ch - lh);
        if (newX !== legendPos.x || newY !== legendPos.y) {
            const pos: LegendPos = { x: Math.max(0, newX), y: Math.max(0, newY) };
            setLegendPos(pos);
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(pos));
            } catch {}
        }
    }, [fullscreen, legendPos.x, legendPos.y]);

    // ==== Данные легенды ====
    const legendData = lines.map((line, index) => ({
        value: line.name,
        color: `hsl(${(index * 60) % 360}, 70%, 50%)`,
        type: "line",
        id: line.name,
    }));

    // ==== Кастомная легенда ====
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

    // ==== Рендер ====
    return (
        <div
            className={!fullscreen ? styles.container : styles.fullScreenContainer}
            ref={containerRef}
            style={{ overflow: "visible", position: "relative" }}
        >
            <div
                style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}
            >
                <h2 className={styles.title}>{name}</h2>
                <button
                    className={styles.fullScreenButton}
                    onClick={() => setFullscreen((v) => !v)}
                    aria-label={fullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                >
                    {fullscreen ? <CloseFullscreenIcon /> : <OpenInFullIcon />}
                </button>
            </div>

            <ResponsiveContainer width="100%" height={fullscreen ? "100%" : 500}>
                <LineChart data={chartData as any}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        type="number"
                        dataKey="x"
                        domain={['dataMin', 'dataMax']}
                        allowDuplicatedCategory={false}
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
                            connectNulls
                            isAnimationActive={false}
                        />
                    ))}
                </LineChart>
            </ResponsiveContainer>

            {/* Перетаскиваемая легенда поверх графика */}
            <CustomLegend />
        </div>
    );
}
