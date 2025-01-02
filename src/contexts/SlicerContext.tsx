import axios from 'axios';
import { createContext, useEffect, useRef, useState } from 'react';
import { ColorChange, ListPart, Printer, PrinterType, RenderResult, ServerType } from '../types';
import { toast } from '../utils';
import { useBrowserStore } from './contextHooks';
//@ts-ignore
import OctoPrintService from '../services/octoprint';
import BaseService from '../services/unimplemented';

export interface SlicerContextType {
    slice(parts: ListPart[], signal?: AbortSignal, colorChange?: ColorChange): Promise<string>;
    render(fileName: string, vars: Record<string, unknown>): Promise<RenderResult>;
}
export const SlicerContext = createContext<SlicerContextType | undefined>(undefined);
export function SlicerContextProvider(props: {
    children: React.ReactNode;
    printerType: PrinterType;
}) {
    const slice = async (parts: ListPart[], signal?: AbortSignal, colorChange?: ColorChange) => {
        const res = await axios.post(
            '/slice',
            { parts, printerType: props.printerType, colorChange },
            { responseType: 'text', signal }
        );
        return res?.data;
    };

    const render = async (fileName: string, vars: Record<string, unknown>) => {
        const res = await axios.post('/render', { fileName, vars });
        return res?.data;
    };

    return (
        <SlicerContext.Provider
            value={{
                slice,
                render,
            }}
        >
            {props.children}
        </SlicerContext.Provider>
    );
}
