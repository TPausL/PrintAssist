import express from 'express';
import ViteExpress from 'vite-express';
import { exec } from 'child_process';
import { promisify } from 'util';
import bodyParser from 'body-parser';
import {
    Printer,
    PrinterType,
    RenderRequest,
    ServerType,
    Settings,
    SliceRequest,
    TypedRequestBody,
} from '../src/types';
import _ from 'lodash';
import fs from 'fs';
import path from 'path';
import 'dotenv/config';
import { randomUUID } from 'crypto';

const { map } = _;

const execAsync = promisify(exec);
const mkdirAsync = promisify(fs.mkdir);

const app = express();

ViteExpress.config({ mode: process.env.NODE_ENV as 'production' | 'development' });
//app.use(bodyParser.urlencoded({ extended: true }));

//allow all cors origins
app.use((req, res, next) => {
    //res.header('Access-Control-Allow-Origin', '*');
    next();
});
app.use(express.json());

app.post('/render', async (req: RenderRequest, res) => {
    if (!fs.existsSync('./models/rendered')) await mkdirAsync('./models/rendered');
    const var_str = map(req.body.vars, (v, k) => { return typeof v === "string" || v instanceof String ? `-D '${k}="${v}"'` : `-D '${k}=${v}'` }).join(' ');
    console.log("vars: ", var_str);
    const stdout = await execAsync(
        `openscad -o ./models/rendered/${req.body.fileName.split('.')[0]}.stl ./models/${req.body.fileName} ${var_str}`
    );
    console.log(stdout);
    return res.send({ success: true, stlPath: `rendered/${req.body.fileName.split('.')[0]}.stl` });
});

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
                console.log(outPath);
                return outPath;
            })
        );
        console.log(files);
        const r = await execAsync(
            `prusa-slicer --load config.${req.body.printerType
            }.ini -o ./models/generated/out.gcode -g -m ${files.join(' ')}`
        );
        console.log(r);
        if (req.body.colorChange) {
            let gcode = fs.readFileSync('./models/generated/out.gcode').toString();
            let regex = new RegExp(String.raw`;<LAYER_END:${req.body.colorChange.height}>`, 'g');
            console.log(gcode.match(regex));
            gcode = gcode.replace(regex, `M600`);
            fs.writeFileSync('./models/generated/out.gcode', gcode);
        }
        res.sendFile(path.join(process.cwd(), '/models/generated/out.gcode'));
    } catch (e) {
        console.log(e)
        if (e.stderr.includes('could not fit')) {
            res.status(413).send('Die Teile passen nicht auf das Druckbett!');
        }
        if (e.stderr.includes('No such file or directory')) {
            res.status(404).send('Die Datei wurde nicht gefunden!');
        }
        res.status(500).send('Ein Fehler ist aufgetreten!');
    }
});

app.post('/settings', async (req: TypedRequestBody<Settings>, res) => {
    for (const printer of req.body.printers) {
        //check whether the hostname in the body printer settings is valid with a regex
        //regex matching url or hostname including optional port
        const urlRegex = new RegExp(/^(([^:]+):)?\/\/([-\w._]+)(:(\d+))?(\/[-\w._]\?(.+)?)?$/gi);
        if (!printer.hostname.match(urlRegex)) {
            res.status(422).send('invalid hostname in printer: ' + printer.hostname);
            return;
        }
        const schemeRegex = new RegExp(/^([a-z0-9]+):\/\//gi);
        if (!printer.hostname.match(schemeRegex)) {
            printer.hostname = 'http://' + printer.hostname;
        }
    }
    //write req.body to file to json file
    fs.writeFileSync('./db/settings.json', JSON.stringify(req.body));
    res.send({ success: true, data: req.body });
});

const defaultPrinter: Omit<Printer, 'id'> = {
    name: 'Dummy Printer (change me later)',
    hostname: '',
    api_key: '',
    printerType: 'dummy' as PrinterType,
    functions: [],
    serverType: 'dummy' as ServerType,
};
//get request to send the settings in the json file back to the user
app.get('/settings', async (req, res) => {
    //check whether the settings file exists
    if (!fs.existsSync('./db/settings.json')) {
        let defaultSettings: Settings = {
            printers: [
                {
                    ...defaultPrinter,
                    id: randomUUID(),
                },
            ],
        };
        if (!fs.existsSync('./db')) await mkdirAsync('./db');
        fs.writeFileSync('./db/settings.json', JSON.stringify(defaultSettings));
    }
    //send file content as application json to user
    res.sendFile(path.join(process.cwd(), '/db/settings.json'));
});

app.post('/settings/new-printer', async (req, res) => {
    const settings: Settings = JSON.parse(fs.readFileSync('./db/settings.json').toString());
    settings.printers.push({
        ...defaultPrinter,
        id: randomUUID(),
    });
    fs.writeFileSync('./db/settings.json', JSON.stringify(settings));
    res.send({ success: true, data: settings });
});

app.delete('/settings/printer/:id', async (req, res) => {
    const settings: Settings = JSON.parse(fs.readFileSync('./db/settings.json').toString());
    settings.printers = settings.printers.filter((p) => p.id !== req.params.id);
    fs.writeFileSync('./db/settings.json', JSON.stringify(settings));
    res.send({ success: true, data: settings });
});
ViteExpress.listen(app, 3000, () => console.log('server is listening'));
