import {
    AnchorButton,
    Button,
    ButtonGroup,
    Card,
    Icon,
    Navbar,
    Overlay,
    ProgressBar,
    Spinner,
} from '@blueprintjs/core';
import { filter, includes, isEqual, map, remove, set } from 'lodash';
import { useEffect, useRef, useState } from 'react';
import styles from './App.module.scss';
import { PartList } from './components/part-list/part-list';
import { PartSelect } from './components/part-select/part-select';
import { ListPart, PartType } from './types';

import { SettingsDialog } from './components/settings-dialog/settings-dialog';
import { usePrinter } from './contexts/contextHooks';
import { extractDataFromGcode, toast } from './utils';
import { AxiosError } from 'axios';
import { ConfirmDialog } from './components/confirm-dialog/confirm-dialog';
import { GcodePreview } from './components/gcode-preview/gcode-preview';
import moment from 'moment';
import { SpoolColorPicker } from './components/spool-color-picker/spool-color-picker';
import { isMobile } from 'react-device-detect';

function App() {
    const [parts, setParts] = useState<ListPart[]>([]);
    const [gcode, setGcode] = useState<string | undefined>(undefined);
    const [slicing, setSlicing] = useState<boolean>();
    const [settingsOpen, setSettingsOpen] = useState<boolean>(false);
    const [confirmOpen, setConfirmOpen] = useState<boolean>(false);
    const [printing, setPrinting] = useState<boolean>(false);
    const printer = usePrinter();
    const shouldSlice = useRef<boolean>(false);
    const failCount = useRef<number>(0);

    const controllerRef = useRef<AbortController | undefined>(new AbortController());

    const slice = (ps: ListPart[], signal?: AbortSignal) => {
        return new Promise<string>((resolve, reject) => {
            printer?.slice(ps, signal).then((res) => {
                resolve(res);
            });
        });
    };

    useEffect(() => {
        setSlicing(true);
        console.log('parts');
        controllerRef.current?.abort();
        controllerRef.current = new AbortController();
        printer
            ?.slice(parts, controllerRef.current?.signal)
            .then((res) => {
                setGcode(res);
            })
            .finally(() => {
                setSlicing(false);
            });
    }, [parts]);

    useEffect(() => {
        console.log(slicing);
    }, [slicing]);

    const temptest = printer?.temperature && printer?.temperature >= 195;
    return (
        <div className={styles.App}>
            <Navbar fixedToTop>
                <Navbar.Group>
                    <Navbar.Heading>PrintAssist</Navbar.Heading>
                </Navbar.Group>
                <Navbar.Group align="right">
                    {!printer?.printing && (
                        <>
                            {temptest && (
                                <>
                                    <h3 style={{ margin: 0, marginRight: 8 }}>Filament</h3>
                                    <Button
                                        icon="arrow-left"
                                        text={isMobile ? undefined : 'zurückziehen'}
                                        minimal
                                        large
                                        onClick={() => printer?.extrude(-5)}
                                    />
                                    <Button
                                        icon="arrow-right"
                                        text={isMobile ? undefined : 'rausdrücken'}
                                        minimal
                                        large
                                        onClick={() => printer?.extrude(5)}
                                    />
                                    <Navbar.Divider />
                                </>
                            )}

                            <Button
                                icon="flame"
                                text={isMobile ? undefined : 'Aufheizen'}
                                minimal
                                large
                                onClick={() => printer?.heat(200)}
                            />
                            <Navbar.Divider />
                        </>
                    )}
                    <Button
                        icon={
                            <Icon
                                icon="lightbulb"
                                color={printer?.lightState ? 'yellow' : undefined}
                            />
                        }
                        text={isMobile ? undefined : 'Licht'}
                        minimal
                        large
                        onClick={() => printer?.toggleLight()}
                    />

                    <Navbar.Divider />
                    <Button
                        icon="cog"
                        text={isMobile ? undefined : 'Einstellungen'}
                        minimal
                        large
                        onClick={() => setSettingsOpen(true)}
                    />
                </Navbar.Group>
            </Navbar>
            <div className={styles.content}>
                <Card elevation={2} className={styles['part-select-card']}>
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
                {Boolean(parts.length) && (
                    <Card elevation={2}>
                        <div></div>
                        <div className={styles['button-group-wrapper']}>
                            {slicing && (
                                <ProgressBar
                                    value={1}
                                    animate={true}
                                    className={styles['progress-bar']}
                                />
                            )}
                            {gcode && !slicing && (
                                <div className={styles['summary-wrapper']}>
                                    <div>
                                        <h3>Zeit:</h3>
                                        <p>
                                            {moment
                                                .duration(extractDataFromGcode(gcode).time, 's')
                                                .humanize()}
                                        </p>
                                        <h3>Gewicht:</h3>
                                        <p>{extractDataFromGcode(gcode).weight.toFixed(2)}g</p>
                                        <h3>Preis:</h3>
                                        <p>{extractDataFromGcode(gcode).price.toFixed(2)}€</p>
                                    </div>
                                    <GcodePreview gcode={gcode} />
                                    <ButtonGroup vertical large className={styles['button-group']}>
                                        <SpoolColorPicker />
                                        <AnchorButton
                                            href={
                                                'data:text/plain;charset=utf-8,' +
                                                encodeURIComponent(gcode as string)
                                            }
                                            download={'print.gcode'}
                                        >
                                            Herunterladen
                                        </AnchorButton>
                                        <Button
                                            intent="primary"
                                            onClick={() => {
                                                setConfirmOpen(true);
                                            }}
                                        >
                                            Drucken
                                        </Button>
                                    </ButtonGroup>
                                </div>
                            )}
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
                        setPrinting(true);
                        gcode ? await printer?.print(gcode) : toast('No gcode to print', 'warning');
                        setPrinting(false);
                    } catch (err: AxiosError | any) {
                        toast('Error trying to print!', 'danger');
                    }
                    setConfirmOpen(false);
                }}
                onCanceled={() => setConfirmOpen(false)}
            ></ConfirmDialog>
            <Overlay isOpen={printing} canEscapeKeyClose={false} canOutsideClickClose={false}>
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '100vw',
                        height: '100vh',
                    }}
                >
                    <Spinner size={200} intent="primary"></Spinner>
                </div>
            </Overlay>
            <div />
        </div>
    );
}

export default App;
