import axios from 'axios';
import { createContext, useEffect, useRef, useState } from 'react';
import { ListPart, Printer, ServerType } from '../types';
import { toast } from '../utils';
import { useBrowserStore } from './contextHooks';
//@ts-ignore
import OctoPrintService from '../services/octoprint';
import BaseService from '../services/unimplemented';

export interface PrinterContextType {
    print(gcode: string): void;
    heat(temp: number): void;
    sendCommands(commands: string[]): void;
    unload(): void;
    lightState: boolean;
    toggleLight(): void;
    extrude(amount: number): void;
    temperature: number;
    printing: boolean;
    selectedPrinter: Printer;
    live: boolean;
}

const getService = (printer: Printer) => {
    switch (printer.serverType) {
        case ServerType.OCTOPRINT:
            return new OctoPrintService(printer);
        case ServerType.PRUSALINK:
            console.error('PrusaLink not implemented');
        case ServerType.PRUSACONNECT:
            console.error('PrusaConnect not implemented');
        case ServerType.DUMMY:
            return new BaseService();
        default:
            throw new Error('Unknown printer type');
    }
};

export const PrinterContext = createContext<PrinterContextType | undefined>(undefined);
export function PrinterContextProvider(props: { children: React.ReactNode; printer: Printer }) {
    const tempInterval = useRef<NodeJS.Timeout | undefined>(undefined);
    const healthInterval = useRef<NodeJS.Timeout | undefined>(undefined);
    //const printerLive = useRef<boolean | undefined>(undefined);
    const [printerLive, setPrinterLive] = useState<boolean>(false);
    const [light, setLight] = useState<boolean>(false);
    const [temperature, setTemperature] = useState<number>(0);
    const [printing, setPrinting] = useState<boolean>(false);

    const browserStore = useBrowserStore();

    const service: BaseService = getService(props.printer);

    const extrude = async (amount: number) => {
        try {
            service.extrude(amount);
            toast('Extruding ' + amount + 'mm', 'success');
        } catch (err) {
            toast('Error extruding', 'danger');
        }
    };
    const toggleLight = async () => {
        try {
            service.setLight(!light);
            setLight(!light);
        } catch (err) {
            toast('Error toggling light', 'danger');
        }
    };
    const heat = async (temp: number) => {
        try {
            service.heat(temp);
            toast('Heating up', 'success');
        } catch (err) {
            toast('Error heating up', 'danger');
        }
    };

    const print = async (gcode: string) => {
        service.print(gcode);
        toast('Succesfully printed!', 'success');
    };

    const getPrinterData = async () => {
        return service.getPrinterData();
    };

    const getDynamicData = async () => {
        try {
            const { temp, printing } = await getPrinterData();
            setTemperature(temp);
            setPrinting(printing);
        } catch (err) {}
    };

    useEffect(() => {
        clearInterval(healthInterval.current);
        setPrinterLive(false);
        healthInterval.current = setInterval(async () => {
            const res = await service.healthCheck();
            console.log('Health check', props.printer.name, res);
            setPrinterLive(res);
        }, 5000);
        service.healthCheck().then((res) => {
            setPrinterLive(res);
        });
    }, [props.printer]);

    useEffect(() => {
        if (printerLive) {
            clearInterval(tempInterval.current);
            setTemperature(0);
            setLight(false);
            setPrinting(false);
            getDynamicData();
            tempInterval.current = setInterval(async () => {
                getDynamicData();
            }, 5000);
        }
    }, [printerLive]);
    const sendCommands = async (commands: string[]) => {
        try {
            service.sendCommands(commands);
        } catch (err) {
            toast('Error sending commands' + commands.join(' | '), 'danger');
        }
    };

    const unload = () => {
        service.unload();
    };

    return (
        <PrinterContext.Provider
            value={{
                heat,
                print,
                lightState: light,
                toggleLight,
                extrude,
                unload,
                sendCommands,
                printing,
                temperature,
                selectedPrinter: props.printer,
                live: printerLive,
            }}
        >
            {props.children}
        </PrinterContext.Provider>
    );
}
