import partList from "./part-list.json" assert {type: "json"}
import util from 'node:util';
import moment from "moment";
const exec = util.promisify((await import('node:child_process')).exec);
import { readFile } from 'node:fs/promises';



for(const i in partList.parts) {
    const p = partList.parts[i];
    const model_file = "./models/" + p.file;
    const gcode_file = "./models/" + p.file.split(".")[0] + ".gcode";
    console.log(model_file)
    const  {stdout} = await exec("prusa-slicer -g --load config.ini " + model_file);
    const gcode = await readFile(gcode_file,  { encoding: 'utf8' });
    console.log(extractDataFromString(gcode))
}

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
  const cost = costMatch ? parseFloat(costMatch[1]) : 0;

  return {
    time,
    weight,
    cost
  };
}

function timeToSeconds(hours, minutes, seconds) {
  return (hours * 3600) + (minutes * 60) + seconds;
}