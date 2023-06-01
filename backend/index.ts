import express from 'express';
import ViteExpress from 'vite-express';
import { exec } from 'child_process';
import { promisify } from 'util';
import bodyParser from "body-parser";
import { SliceRequest } from "../src/types"
import _ from "lodash";
import fs from "fs"
import path from "path"
const { map } = _;


const execAsync = promisify(exec);
const mkdirAsync = promisify(fs.mkdir);

const app = express();
//app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json());


app.post('/slice', async (req: SliceRequest, res) => {
    if (!fs.existsSync("./models/generated")) await mkdirAsync("./models/generated")
    const files: string[] = await Promise.all(map(req.body.parts, async (p) => {
        const outPath = "./models/generated/" + p.name.toLowerCase().replace(/[^a-zA-Z0-9]/g, "") + ".3mf";
        await execAsync(`prusa-slicer -o ${outPath} --duplicate ${p.count} --export-3mf ./models/${p.file}`)
        return outPath;
    }))
    console.log(files.join(" "))
    const r = await execAsync(`prusa-slicer --load config.ini -o ./models/generated/out.gcode -g -m ${files.join(" ")}`)
    console.log(process.cwd())
    res.sendFile(path.join(process.cwd(), "/models/generated/out.gcode"))
});
ViteExpress.listen(app, 3000, () => console.log('server is listening'));
