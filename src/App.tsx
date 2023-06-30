import { AnchorButton, Button, ButtonGroup, Card, Navbar, ProgressBar } from '@blueprintjs/core';
import { filter, includes, isEqual, map, remove } from 'lodash';
import { useEffect, useRef, useState } from 'react';
import styles from './App.module.scss';
import { PartList } from './components/part-list/part-list';
import { PartSelect } from './components/part-select/part-select';
import { ListPart, PartType } from './types';

import { SettingsDialog } from './components/settings-dialog/settings-dialog';
import { usePrinter } from './contexts/contextHooks';
import { toast } from './utils';
import { AxiosError } from 'axios';
import { ConfirmDialog } from './components/confirm-dialog/confirm-dialog';

function App() {
    const [parts, setParts] = useState<ListPart[]>([]);
    const [gcode, setGcode] = useState<string | undefined>(undefined);
    const [slicing, setSlicing] = useState<boolean>(false);
    const [settingsOpen, setSettingsOpen] = useState<boolean>(false);
    const [confirmOpen, setConfirmOpen] = useState<boolean>(false);
    const printer = usePrinter();
    const shouldSlice = useRef<boolean>(false);
    const failCount = useRef<number>(0);

    const preview = () => {};
    const slice = async () => {
        shouldSlice.current = false;
        setSlicing((n) => true);
        try {
            console.log('Slicing');
            const gcode_res = await printer?.slice(parts);
            failCount.current = 0;
            setGcode(gcode_res);
        } catch (err: AxiosError | any) {
            console.log('slicing failed');
            failCount.current++;
            if (failCount.current >= 3) {
                toast('Slicing failed!', 'danger');
            } else {
                await slice();
            }
        }
        if (shouldSlice.current) {
            console.log('re slice');
            await slice();
        }
        console.log('done slicing');
        setSlicing((n) => false);
    };
    useEffect(() => {
        console.log(`parts changed slicing:${slicing}, shouldSlice:${shouldSlice.current}`);
        if (parts.length) {
            if (!slicing) {
                slice();
            } else {
                shouldSlice.current = true;
            }
        }
    }, [parts]);

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
                <Card elevation={2}>
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
                </Card>
                {Boolean(parts.length) && (
                    <Card elevation={2}>
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
                    </Card>
                )}
                {gcode && (
                    <Card elevation={2}>
                        <div className={styles['button-group-wrapper']}>
                            {slicing && (
                                <ProgressBar
                                    value={1}
                                    animate={true}
                                    className={styles['progress-bar']}
                                />
                            )}

                            <ButtonGroup className={styles['button-group']}>
                                {false && Boolean(parts.length) && (
                                    <Button
                                        onClick={async () => {
                                            setSlicing(true);
                                            try {
                                                setGcode(await printer?.slice(parts));
                                            } catch (err: AxiosError | any) {
                                                toast(err.response.data, 'danger');
                                            }
                                            setSlicing(false);
                                        }}
                                    >
                                        {gcode ? 're-slice' : 'slice'}
                                    </Button>
                                )}
                                {gcode && !slicing && (
                                    <Button
                                        onClick={() => {
                                            setConfirmOpen(true);
                                            console.log('print');
                                        }}
                                    >
                                        print
                                    </Button>
                                )}
                                {gcode && !slicing && (
                                    <Button
                                        onClick={() => {
                                            preview();
                                        }}
                                    >
                                        preview
                                    </Button>
                                )}
                                {gcode && !slicing && (
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
                    </Card>
                )}
            </div>
            <SettingsDialog isOpen={settingsOpen} onClosed={() => setSettingsOpen(false)} />
            <ConfirmDialog
                isOpen={confirmOpen}
                onClosed={() => setConfirmOpen(false)}
                onConfirmed={async () => {
                    try {
                        gcode ? await printer?.print(gcode) : toast('No gcode to print', 'warning');
                    } catch (err: AxiosError | any) {
                        toast('Error trying to print!', 'danger');
                    }
                    setConfirmOpen(false);
                }}
                onCanceled={() => setConfirmOpen(false)}
            ></ConfirmDialog>
            <div />
        </div>
    );
}

export default App;
