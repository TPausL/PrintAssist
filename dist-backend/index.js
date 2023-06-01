import express from 'express';
import ViteExpress from 'vite-express';
import { exec } from 'child_process';
import { promisify } from 'util';
const execAsync = promisify(exec);
const app = express();
//app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.post('/slice', async (req, res) => {
    console.log(req.body);
    const r = await execAsync("prusa-slicer --help");
    res.send(r);
});
ViteExpress.listen(app, 3000, () => console.log('server is listening'));
