import { AnchorButton, Button, ButtonGroup, Navbar, ProgressBar } from '@blueprintjs/core';
import { filter, includes, isEqual, isEqualWith, map, merge, remove } from 'lodash';
import { useState } from 'react';
import styles from './App.module.scss';
import { PartList } from './components/part-list/part-list';
import { PartSelect } from './components/part-select/part-select';
import { ListPart, PartType } from './types';
import { slice } from './utils';
import { SettingsDialog } from './components/settings-dialog/settings-dialog';
import { usePrinter } from './contexts/contextHooks';

function App() {
    const [parts, setParts] = useState<ListPart[]>([]);
    const [gcode, setGcode] = useState<string | undefined>(undefined);
    const [slicing, setSlicing] = useState<boolean>(false);
    const [settingsOpen, setSettingsOpen] = useState<boolean>(false);
    const printer = usePrinter();
    const preview = () => {};
    return (
        <div className={styles.App}>
            <Navbar fixedToTop>
                <Navbar.Group>
                    <Navbar.Heading>PrintAssist</Navbar.Heading>
                </Navbar.Group>
                <Navbar.Group align="right">
                    <Button icon="cog" minimal onClick={() => setSettingsOpen(true)} />
                </Navbar.Group>
            </Navbar>
            <div className={styles.content}>
                <PartSelect
                    onPartAdded={(part) => {
                        {
                            if (includes(map(parts, 'name'), part.name)) {
                                const p = remove(
                                    parts,
                                    (p) => p.name.toLowerCase() == part.name.toLowerCase()
                                )[0];
                                setParts([...parts, { ...p, count: p.count + 1 }]);
                            } else {
                                setParts([...parts, { ...part, count: 1 }]);
                            }
                        }
                    }}
                />
                <PartList
                    parts={parts}
                    handlers={{
                        remove: (p) => setParts(filter(parts, (v) => !isEqual(v, p))),
                        count: (p, c) => {
                            const i = parts.indexOf(p);
                            parts[i] = { ...parts[i], count: c };
                            setParts([...parts]);
                        },
                    }}
                />
                <div className={styles['progress-bar-wrapper']}>
                    {slicing && (
                        <ProgressBar value={1} animate={true} className={styles['progress-bar']} />
                    )}
                </div>
                <div className={styles['button-group-wrapper']}>
                    <ButtonGroup className={styles['button-group']}>
                        {Boolean(parts.length) && (
                            <Button
                                onClick={async () => {
                                    setSlicing(true);
                                    setGcode(await slice(parts));
                                    setSlicing(false);
                                }}
                            >
                                {gcode ? 're-slice' : 'slice'}
                            </Button>
                        )}
                        {gcode && (
                            <Button
                                onClick={() => {
                                    printer?.print(gcode);
                                }}
                            >
                                print
                            </Button>
                        )}
                        {gcode && (
                            <Button
                                onClick={() => {
                                    preview();
                                }}
                            >
                                preview
                            </Button>
                        )}
                        {gcode && (
                            <AnchorButton
                                href={
                                    'data:text/plain;charset=utf-8,' +
                                    encodeURIComponent(gcode as string)
                                }
                                download={'print.gcode'}
                            >
                                download
                            </AnchorButton>
                        )}
                    </ButtonGroup>
                </div>
            </div>
            <SettingsDialog isOpen={settingsOpen} onClosed={() => setSettingsOpen(false)} />
        </div>
    );
}

export default App;
