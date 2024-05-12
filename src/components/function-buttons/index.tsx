import { Button, ButtonProps } from '@blueprintjs/core';
import { usePrinter } from '../../contexts/contextHooks';
import { PrinterContextType } from '../../contexts/PrinterContext';

const UnloadButton = () => {
    const { unload } = usePrinter() as PrinterContextType;
    return <Button onClick={unload} icon="eject" text="Filament entladen" intent="warning" />;
};

const HeatButton = () => {
    const { heat } = usePrinter() as PrinterContextType;
    return <Button onClick={() => heat(205)} icon="flame" text="Düse Aufheizen" intent="success" />;
};

const LightButton = () => {
    const { toggleLight } = usePrinter() as PrinterContextType;
    return <Button onClick={toggleLight} icon="lightbulb" text="Licht" intent="none" />;
};

const ManuellExtrusionButtons = () => {
    const { extrude, temperature } = usePrinter() as PrinterContextType;
    const hot = temperature > 195;
    return (
        <>
            <Button
                onClick={() => extrude(10)}
                icon="arrow-down"
                text="Rausdrücken"
                intent={hot ? 'primary' : 'danger'}
                disabled={!hot}
            />
            <Button
                onClick={() => extrude(-10)}
                intent={hot ? 'primary' : 'danger'}
                icon="arrow-up"
                text="Einziehen"
                disabled={!hot}
            />
        </>
    );
};

const BedTempButton = () => {
    return <Button icon="flame" text="Noch nicht fertig!" />;
};

const PreheatButton = () => {
    return <Button icon="flame" text="Noch nicht fertig!" />;
};

const functionButtons = {
    filament_unload: <UnloadButton />,
    nozzle_temp: <HeatButton />,
    light: <LightButton />,
    manuell_extrusion: <ManuellExtrusionButtons />,
    bed_temp: <BedTempButton />,
    preheat: <PreheatButton />,
};

export default functionButtons;
