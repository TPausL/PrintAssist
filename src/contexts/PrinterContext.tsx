import { createContext, useEffect, useRef, useState } from 'react';
import { useSettings } from './contextHooks';
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { ListPart, Spool, Spools } from '../types';
import { toast } from '../utils';
import { compact, get, pickBy, set, sortBy, toArray } from 'lodash';
//@ts-ignore
import { sortFn } from 'color-sorter';
import { OverlayToaster, ToasterInstance } from '@blueprintjs/core';

export interface PrinterContextType {
    print(gcode: string): void;
    selectSpool(spoolId: number): void;
    slice(parts: ListPart[], signal?: AbortSignal): Promise<string>;
    heat(temp: number): void;
    spools?: Spools;
    lightState: boolean;
    toggleLight(): void;
    extrude(amount: number): void;
    temperature: number;
    printing: boolean;
}

export const PrinterContext = createContext<PrinterContextType | undefined>(undefined);
const toaster = OverlayToaster.create({ position: 'top' });
export function PrinterContextProvider(props: { children: React.ReactNode }) {
    const settings = useSettings();
    const tempInterval = useRef<NodeJS.Timeout | undefined>(undefined);
    const printerLive = useRef<boolean | undefined>(undefined);
    const [spools, setSpools] = useState<Spools | undefined>();
    const [axiosSettings, setAxiosSettings] = useState<AxiosRequestConfig | undefined>(undefined);
    const [light, setLight] = useState<boolean>(false);
    const [temperature, setTemperature] = useState<number>(0);
    const [printing, setPrinting] = useState<boolean>(false);
    const slice = async (parts: ListPart[], signal: AbortSignal) => {
        const res = await axios.post('/slice', { parts }, { responseType: 'text', signal });
        return res?.data;
    };
    const extrude = async (amount: number) => {
        try {
            await axios.post(
                '/api/printer/tool',
                { command: 'extrude', amount: amount, speed: 150 },
                axiosSettings
            );
            toast('Extruding ' + amount + 'mm', 'success');
        } catch (err) {
            toast('Error extruding', 'danger');
        }
    };
    const toggleLight = async () => {
        try {
            await axios.patch('/plugin/enclosure/outputs/1', { status: !light }, axiosSettings);
            setLight(!light);
        } catch (err) {
            toast('Error toggling light', 'danger');
        }
    };
    const heat = async (temp: number) => {
        try {
            await axios.post(
                '/api/printer/tool',
                { command: 'target', targets: { tool0: temp } },
                axiosSettings
            );
            toast('Heating up', 'success');
        } catch (err) {
            toast('Error heating up', 'danger');
        }
    };

    const print = async (gcode: string) => {
        const form = new FormData();
        const blob = new Blob([gcode], { type: 'application/octet-stream' });
        form.append('file', blob, 'outtt.gcode');
        form.append('select', 'true');
        form.append('print', 'true');
        form.append('path', 'generated');
        await axios.post('/api/files/local', form, axiosSettings);
        toast('Succesfully printed!', 'success');
    };

    const selectSpool = async (spoolId: number) => {
        try {
            const res = await axios.put(
                `/plugin/SpoolManager/selectSpool`,
                {
                    toolIndex: 0,
                    databaseId: spoolId,
                },
                axiosSettings
            );
            setSpools({ ...spools, selectedSpools: [res.data.selectedSpool] } as Spools);
            toast('Spool successfully selected', 'success');
        } catch (err) {
            toast('Error selecting spool', 'danger');
        }
    };
    useEffect(() => {
        if (settings?.values?.printer) {
            setAxiosSettings({
                baseURL: `${settings?.values?.printer.hostname}`,
                headers: {
                    Authorization: `Bearer ${settings?.values?.printer.api_key}`,
                },
            });
        } else {
        }
    }, [settings]);

    const getPrinterData = async () => {
        const res = await axios.get('/api/printer', axiosSettings);
        return { temp: res.data.temperature.tool0.actual, printing: res.data.state.flags.printing };
    };

    const getStaticData = async () => {
        axios
            .get(
                '/plugin/SpoolManager/loadSpoolsByQuery?filterName=hideInactiveSpools&from=0&to=3000&sortColumn=lastUse&sortOrder=desc',
                axiosSettings
            )
            .then((res: AxiosResponse<Spools>) => {
                res.data.allSpools = toArray(
                    pickBy(
                        res.data.allSpools.sort((a, b) => sortFn(a.color, b.color)),
                        (s) => !s.isTemplate
                    )
                );

                setSpools(res.data);
            })
            .catch((err) => {
                console.log('error gettings spool data');
            });
        axios.get('/plugin/enclosure/outputs/1', axiosSettings).then((res) => {
            setLight(res.data.currentLight);
        });
    };

    const getDynamicData = async () => {
        try {
            const { temp, printing } = await getPrinterData();
            setTemperature(temp);
            setPrinting(printing);
            console.log('got data');
            if (!printerLive.current) {
                console.log('printer is live');
                printerLive.current = true;
                toaster.clear();
                getStaticData();
            }
        } catch (err) {
            console.log('error getting printer data');

            if (printerLive.current !== false) {
                console.log(printerLive, "printer isn't live");
                printerLive.current = false;

                toaster.show({
                    message: 'Der Drucker kann nicht erreicht werden!',
                    intent: 'danger',
                    timeout: 0,
                    isCloseButtonShown: false,
                });
            }
        }
    };

    useEffect(() => {
        if (axiosSettings === undefined) return;
        clearInterval(tempInterval.current);
        setSpools(undefined);
        setTemperature(0);
        setLight(false);
        getDynamicData();
        tempInterval.current = setInterval(async () => {
            getDynamicData();
        }, 5000);
    }, [axiosSettings]);

    return (
        <PrinterContext.Provider
            value={{
                heat,
                print,
                spools,
                selectSpool,
                slice,
                lightState: light,
                toggleLight,
                extrude,
                printing,
                temperature,
            }}
        >
            {props.children}
        </PrinterContext.Provider>
    );
}
