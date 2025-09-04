import {useState} from "react";
import {Dropdown} from "../components/Dropdown/Dropdown.tsx";
import {Button} from "../components/Button/Button.tsx";
import {ValueList} from "../components/ValueList/ValueList.tsx";
import {Dialog} from "../components/Dialog/Dialog.tsx";
import {Chart} from "../components/Chart/Chart.tsx";

export function Components() {

    const [selected, setSelected] = useState<string>("option1");
    const [buttonCounter, setButtonCounter] = useState<number>(0);
    const [open, setOpen] = useState(false);

    const options = [
        { value: "option1", label: "Опция 1" },
        { value: "option2", label: "Опция 2" },
        { value: "option3", label: "Опция 3" },
    ];

    const items = [
        { name: "params0", value: 0.11477015672425277 },
        { name: "params1", value: 0.000266833580181705 },
        { name: "params2", value: 0.0 },
        { name: "Max relative error", value: 1.00, dimension: "%" },
    ];

    const data = {
        name: "Stress vs Strain",
        x_label: "Strain",
        y_label: "Stress (MPa)",
        lines: [
            {
                name: "Simulation",
                data: {
                    x: [0, 0.1, 0.2, 0.3],
                    y: [0, 2, 3, 4],
                },
            },
            {
                name: "Experiment",
                data: {
                    x: [0, 0.1, 0.2, 0.3],
                    y: [0, 1.8, 2.9, 3.9],
                },
            },
        ],
    };

    return (
        <>
            <h1>Компоненты</h1>

            <Dropdown options={options} value={selected} onChange={setSelected} label={'Dropdown'}/>
            <p>Выбрано: {selected}</p>



            <Button onClick={() => setButtonCounter(buttonCounter + 1)} >
                <span>Кликнул раз: </span><span style={{color:'red'}}>{buttonCounter}</span>
            </Button>

            <ValueList title="Optimized parameters for Yeoh" items={items} />

            <Button text="Открыть диалог" onClick={() => setOpen(true)} />

            {open && (
                <Dialog
                    type="info"
                    title="Ошибка!"
                    onClose={() => setOpen(false)}
                >
                    <ValueList title="Optimized parameters for Yeoh" items={items} />

                </Dialog>
            )}

            <Chart {...data} />


        </>
    )
}
