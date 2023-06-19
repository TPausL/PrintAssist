import { createContext, useEffect, useRef, useState } from 'react';
import { useSettings } from './contextHooks';
import axios from 'axios';
import { Spool, Spools } from '../types';
import { toast } from '../utils';
import { set } from 'lodash';

export interface PrinterContextType {
    print(gcode: string): void;
    selectSpool(spoolId: number): void;
    spools?: Spools;
}

export const PrinterContext = createContext<PrinterContextType | undefined>(undefined);

export function PrinterContextProvider(props: { children: React.ReactNode }) {
    const settings = useSettings();

    const [spools, setSpools] = useState<Spools>();
    const [axiosSettings, setAxiosSettings] = useState({
        baseURL: `${settings?.values?.printer.hostname}`,
        headers: {
            Authorization: `Bearer ${settings?.values?.printer.api_key}`,
        },
    });
    const print = (gcode: string) => {
        const form = new FormData();
        const blob = new Blob([gcode], { type: 'application/octet-stream' });
        form.append('file', blob, 'out.gcode');
        form.append('select', 'true');
        form.append('print', 'false');
        form.append('path', 'generated');
        axios.post('/api/files/local', form, axiosSettings);
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
            console.log(err);
        }
    };
    useEffect(() => {
        setAxiosSettings({
            baseURL: `${settings?.values?.printer.hostname}`,
            headers: {
                Authorization: `Bearer ${settings?.values?.printer.api_key}`,
            },
        });
    }, [settings]);
    useEffect(() => {
        console.log(axiosSettings);
        axios
            .get(
                '/plugin/SpoolManager/loadSpoolsByQuery?filterName=hideInactiveSpools&from=0&to=3000&sortColumn=lastUse&sortOrder=desc',
                axiosSettings
            )
            .then((res) => {
                console.log(res.data);
                setSpools(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }, [axiosSettings]);
    return (
        <PrinterContext.Provider value={{ print, spools, selectSpool }}>
            {props.children}
        </PrinterContext.Provider>
    );
}
