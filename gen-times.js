import partList from './part-list.json' assert { type: 'json' };
import util from 'node:util';
import moment from 'moment';
const exec = util.promisify((await import('node:child_process')).exec);
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import _ from 'lodash';
const { map, filter, remove } = _;

try {
    await rm('./models/generated', { recursive: true, force: true });
    const createDir = await mkdir('./models/generated', { recursive: true });

    console.log(`created ${createDir}`);
} catch (err) {
    console.error(err.message);
}

const parts = partList.parts;
const nonSliceable = remove(parts, (p) => !/\.(stl|3mf)$/.test(p.file));

const newParts = await Promise.all(
    map(
        filter(parts, (p) => /\.(stl|3mf)$/.test(p.file)),
        (p, i) => {
            return new Promise((resolve) =>
                setTimeout(async () => {
                    //const p = partList.parts[i];
                    const model_file = './models/' + p.file;
                    const gcode_file = './models/generated/' + p.file.split('.')[0] + '.gcode';
                    console.log(model_file);
                    const { stdout } = await exec(
                        `prusa-slicer -o ${gcode_file} -g --load config.mk3s.ini ` + model_file
                    );
                    const gcode = await readFile(gcode_file, { encoding: 'utf8' });
                    resolve({ ...p, ...extractDataFromString(gcode) });
                }, i * 500)
            );
        }
    )
);
writeFile(
    './part-list.json',
    JSON.stringify({ ...partList, parts: [...newParts, ...nonSliceable] })
);
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
