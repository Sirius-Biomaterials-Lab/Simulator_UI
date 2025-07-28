import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { Grid } from "./pages/Grid";
import { Simulator } from "./pages/Simulator";
import {BurgerMenu, MenuItem} from "./components/BurgerMenu/BurgerMenu";
import {Components} from "./pages/Components.tsx";
import { Api } from "./api/api.ts";
import {Isotropic} from "./components/Isotropic/Isotropic.tsx";
import {Anisotropic} from "./components/Anisotropic/Anisotropic.tsx";

export const menuItems: MenuItem[] = [
    { path: "/", label: "Главная" },
    {
        label: "Модели",
        children: [
            { path: "/models/isotropic", label: "Изотропная" },
            { path: "/models/anisotropic", label: "Анизотропная" },
        ],
    },
    { path: "/grid", label: "Сетка" },
    { path: "/simulator", label: "Симулятор" },
    { path: "/components", label: "Компоненты (for devs)" },
];

function App() {

    return (
        <BrowserRouter basename={"/Simulator_UI"}>
            <BurgerMenu items={menuItems} />
            <div style={{ padding: "20px" }}>
                <Routes>
                    <Route path="/" element={<Home />} />
                    {/* Variant captured via URL param to reuse Models page */}
                    <Route path="/models/isotropic" element={<Isotropic />} />
                    <Route path="/models/anisotropic" element={<Anisotropic />} />
                    <Route path="/grid" element={<Grid />} />
                    <Route path="/simulator" element={<Simulator />} />
                    <Route path="/components" element={<Components />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}
export default App;
