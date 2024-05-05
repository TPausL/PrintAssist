import axios, { AxiosRequestConfig } from 'axios';
import { Printer } from '../types';
import BaseService from './unimplemented';

export default class OctoPrintService extends BaseService {
    axiosSettings: AxiosRequestConfig;
    constructor(printer: Printer) {
        super();

        this.axiosSettings = {
            baseURL: `${printer.hostname}`,
            headers: {
                Authorization: `Bearer ${printer.api_key}`,
                'Access-Control-Allow-Origin': '*',
            },
        };
    }

    extrude = async (amount: number) => {
        await axios.post(
            '/api/printer/tool',
            { command: 'extrude', amount: amount, speed: 150 },
            this.axiosSettings
        );
    };
    setLight = async (state: boolean) => {
        await axios.patch('/plugin/enclosure/outputs/1', { status: state }, this.axiosSettings);
    };
    heat = async (temp: number) => {
        await axios.post(
            '/api/printer/tool',
            { command: 'target', targets: { tool0: temp } },
            this.axiosSettings
        );
    };

    sendCommands = async (commands: string[]) => {
        await axios.post(
            '/api/printer/command',
            { commands: commands, parameters: {} },
            this.axiosSettings
        );
    };

    print = async (gcode: string) => {
        const form = new FormData();
        const blob = new Blob([gcode], { type: 'application/octet-stream' });
        form.append('file', blob, 'outtt.gcode');
        form.append('select', 'true');
        form.append('print', 'true');
        form.append('path', 'generated');
        await axios.post('/api/files/local', form, this.axiosSettings);
    };

    unload = async () => {
        const temp = 215;
        await this.heat(temp);
        await this.sendCommands(['M109 S' + temp, 'M702', 'M104 S0']);
    };

    healthCheck = async () => {
        try {
            const res = await axios.get('/api/version', { ...this.axiosSettings });
            return true;
        } catch (e) {
            return false;
        }
    };

    getPrinterData = async () => {
        const res = await axios.get('/api/printer', this.axiosSettings);
        return { temp: res.data.temperature.tool0.actual, printing: res.data.state.flags.printing };
    };
}
