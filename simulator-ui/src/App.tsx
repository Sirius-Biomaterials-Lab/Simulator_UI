import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { Models } from "./pages/Models";
import { Grid } from "./pages/Grid";
import { Simulator } from "./pages/Simulator";
import { BurgerMenu } from "./components/BurgerMenu/BurgerMenu";
import {Components} from "./pages/Components.tsx";

const menuItems = [
    { path: "/", label: "Главная" },
    { path: "/models", label: "Модели" },
    { path: "/grid", label: "Сетка" },
    { path: "/simulator", label: "Симулятор" },
    { path: "/components", label: "Компоненты (for devs)" },
];

function App() {
    return (
        <BrowserRouter>
            <BurgerMenu items={menuItems} />
            <div style={{ padding: "20px" }}>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/models" element={<Models />} />
                    <Route path="/grid" element={<Grid />} />
                    <Route path="/simulator" element={<Simulator />} />
                    <Route path="/components" element={<Components />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;
