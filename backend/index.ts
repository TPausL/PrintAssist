import express from 'express';
import ViteExpress from 'vite-express';
import { exec } from 'child_process';
import { promisify } from 'util';
import bodyParser from 'body-parser';
import { Settings, SliceRequest, TypedRequestBody } from '../src/types';
import _ from 'lodash';
import fs from 'fs';
import path from 'path';
import 'dotenv/config';
const { map } = _;

const execAsync = promisify(exec);
const mkdirAsync = promisify(fs.mkdir);

const app = express();

ViteExpress.config({ mode: process.env.NODE_ENV as 'production' | 'development' });
//app.use(bodyParser.urlencoded({ extended: true }));

//allow all cors origins
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});
app.use(express.json());

app.post('/slice', async (req: SliceRequest, res) => {
    try {
        if (!fs.existsSync('./models/generated')) await mkdirAsync('./models/generated');
        const files: string[] = await Promise.all(
            map(req.body.parts, async (p) => {
                const outPath =
                    './models/generated/' +
                    p.name.toLowerCase().replace(/[^a-zA-Z0-9]/g, '') +
                    '.3mf';
                await execAsync(
                    `prusa-slicer -o ${outPath} --duplicate ${p.count} --export-3mf ./models/${p.file}`
                );
                return outPath;
            })
        );
        const r = await execAsync(
            `prusa-slicer --load config.ini -o ./models/generated/out.gcode -g -m ${files.join(
                ' '
            )}`
        );
        res.sendFile(path.join(process.cwd(), '/models/generated/out.gcode'));
    } catch (e) {
        res.status(500).send("slicing wasn't possible due to a server error");
    }
});

app.post('/settings', async (req: TypedRequestBody<Settings>, res) => {
    //check whether the hostname in the body printer settings is valid with a regex
    //regex matching url or hostname including optional port
    const urlRegex = new RegExp(/^(([^:]+):)?\/\/([-\w._]+)(:(\d+))?(\/[-\w._]\?(.+)?)?$/gi);
    if (!req.body.printer.hostname.match(urlRegex)) {
        res.status(422).send('invalid hostname');
        return;
    }
    const schemeRegex = new RegExp(/^([a-z0-9]+):\/\//gi);
    if (!req.body.printer.hostname.match(schemeRegex)) {
        req.body.printer.hostname = 'http://' + req.body.printer.hostname;
    }

    //write req.body to file to json file
    fs.writeFileSync('./db/settings.json', JSON.stringify(req.body));
    res.send({ success: true, data: req.body });
});

//get request to send the settings in the json file back to the user
app.get('/settings', async (req, res) => {
    //check whether the settings file exists
    if (!fs.existsSync('./db/settings.json')) {
        res.status(404).send('settings not found');
        return;
    }
    //send file content as application json to user
    res.sendFile(path.join(process.cwd(), '/db/settings.json'));
});
ViteExpress.listen(app, 3000, () => console.log('server is listening'));
