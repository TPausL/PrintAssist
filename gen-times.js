import partList from './part-list.json' assert { type: 'json' };
import util from 'node:util';
import moment from 'moment';
const exec = util.promisify((await import('node:child_process')).exec);
import { readFile, writeFile } from 'node:fs/promises';
import _ from 'lodash';
const { map } = _;

const newParts = await Promise.all(
    map(partList.parts, async (p) => {
        //const p = partList.parts[i];
        const model_file = './models/' + p.file;
        const gcode_file = './models/generated/' + p.file.split('.')[0] + '.gcode';
        console.log(model_file);
        const { stdout } = await exec(`prusa-slicer -o ${gcode_file} -g --load config.ini ` + model_file);
        const gcode = await readFile(gcode_file, { encoding: 'utf8' });
        return { ...p, ...extractDataFromString(gcode) };
    })
);
writeFile('./part-list.json', JSON.stringify({ ...partList, parts: newParts }));
function extractDataFromString(str) {
    const timeRegex = /estimated printing time \(normal mode\) = (\d+h)? ?(\d+m)? ?(\d+s)?/;
    const weightRegex = /total filament used \[g\] = (\d+\.\d+)/;
    const costRegex = /total filament cost = (\d+\.\d+)/;

    const timeMatch = str.match(timeRegex);
    const weightMatch = str.match(weightRegex);
    const costMatch = str.match(costRegex);

    const hours = timeMatch[1] ? parseInt(timeMatch[1]) : 0;
    const minutes = timeMatch[2] ? parseInt(timeMatch[2]) : 0;
    const seconds = timeMatch[3] ? parseInt(timeMatch[3]) : 0;
    const time = timeToSeconds(hours, minutes, seconds);

    const weight = weightMatch ? parseFloat(weightMatch[1]) : 0;
    const price = costMatch ? parseFloat(costMatch[1]) : 0;

    return {
        time,
        weight,
        price,
    };
}

function timeToSeconds(hours, minutes, seconds) {
    return hours * 3600 + minutes * 60 + seconds;
}
