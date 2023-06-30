import { createContext, useEffect, useRef, useState } from 'react';
import { useSettings } from './contextHooks';
import axios, { AxiosRequestConfig } from 'axios';
import { ListPart, Spool, Spools } from '../types';
import { toast } from '../utils';

export interface PrinterContextType {
    print(gcode: string): void;
    selectSpool(spoolId: number): void;
    slice(parts: ListPart[]): Promise<string>;
    spools?: Spools;
}

export const PrinterContext = createContext<PrinterContextType | undefined>(undefined);

export function PrinterContextProvider(props: { children: React.ReactNode }) {
    const settings = useSettings();

    const [spools, setSpools] = useState<Spools>();
    const [axiosSettings, setAxiosSettings] = useState<AxiosRequestConfig | undefined>(undefined);

    const slice = async (parts: ListPart[]) => {
        const { data: file } = await axios.post('/slice', { parts }, { responseType: 'text' });
        return file;
    };

    const print = async (gcode: string) => {
        const form = new FormData();
        const blob = new Blob([gcode], { type: 'application/octet-stream' });
        form.append('file', blob, 'outtt.gcode');
        form.append('select', 'false');
        form.append('print', 'false');
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
        console.log('settings changed', settings);
        if (settings?.values?.printer) {
            console.log('settings are ready');
            setAxiosSettings({
                baseURL: `${settings?.values?.printer.hostname}`,
                headers: {
                    Authorization: `Bearer ${settings?.values?.printer.api_key}`,
                },
            });
        } else {
            console.log("settings aren't ready yet");
        }
    }, [settings]);
    useEffect(() => {
        if (axiosSettings === undefined) return;
        axios
            .get(
                '/plugin/SpoolManager/loadSpoolsByQuery?filterName=hideInactiveSpools&from=0&to=3000&sortColumn=lastUse&sortOrder=desc',
                axiosSettings
            )
            .then((res) => {
                console.log('got spool data');
                setSpools(res.data);
            })
            .catch((err) => {
                console.log('error gettings spool data', err);
            });
    }, [axiosSettings]);
    return (
        <PrinterContext.Provider value={{ print, spools, selectSpool, slice }}>
            {props.children}
        </PrinterContext.Provider>
    );
}
