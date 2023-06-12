import axios from 'axios';
import { ListPart } from './types';
export const printerAxios = axios.create({
    baseURL: 'http://octopi/',
    headers: {
        Authorization: 'Bearer 1A53572A31A24E76BC9A141B8DDD3711',
        'Content-Type': 'multipart/form-data',
    },
});

export async function slice(parts: ListPart[]) {
    const { data: file } = await axios.post('/slice', { parts }, { responseType: 'text' });
    console.log(file);
    return file;
}

export async function print(gcode: string) {
    const form = new FormData();
    const test = `M109 T0 S220.000000
T0
G21
G90
`;
    const blob = new Blob([gcode], { type: 'application/octet-stream' });
    form.append('file', blob, 'out.gcode');
    form.append('select', 'false');
    form.append('print', 'false');
    form.append('path', 'generated');
    printerAxios.post('/api/files/local', form);
}
