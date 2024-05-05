import axios, { AxiosRequestConfig } from 'axios';
import { Printer } from '../types';

const UnimplementedError = new Error('Method not implemented');

export default class BaseService {
    extrude = async (amount: number): Promise<void> => {
        throw UnimplementedError;
    };

    setLight = async (state: boolean): Promise<void> => {
        throw UnimplementedError;
    };

    heat = async (temp: number): Promise<void> => {
        throw UnimplementedError;
    };

    print = async (gcode: string): Promise<void> => {
        throw UnimplementedError;
    };

    sendCommands = async (commands: string[]): Promise<void> => {
        throw UnimplementedError;
    };

    getPrinterData = async (): Promise<{ temp: number; printing: boolean }> => {
        throw UnimplementedError;
    };

    healthCheck = async (): Promise<boolean> => {
        throw UnimplementedError;
    };

    unload = async (): Promise<void> => {
        throw UnimplementedError;
    };
}
