import {
    AnchorButton,
    Button,
    ButtonGroup,
    Card,
    Divider,
    Icon,
    Navbar,
    Overlay,
    ProgressBar,
    Spinner,
    Text,
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
import { useMediaQuery } from 'react-responsive';
import { PrinterSettingsCard } from './components/printer-settings-card/printer-settings-card';

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
    const isMobile = useMediaQuery({ query: '(max-width: 1224px)' });

    const controllerRef = useRef<AbortController | undefined>(new AbortController());

    useEffect(() => {
        if (parts.length > 0) {
            setSlicing(() => true);
            controllerRef.current?.abort();
            controllerRef.current = new AbortController();
            printer
                ?.slice(parts, controllerRef.current?.signal)
                .then((res) => {
                    setSlicing(() => false);
                    setGcode(res);
                })
                .finally(() => {})
                .catch((err: AxiosError) => {
                    if (err.code !== 'ERR_CANCELED') {
                        toast('Error slicing', 'danger');
                        setSlicing(false);
                    }
                });
        }
    }, [parts]);

    useEffect(() => {
        console.log(printer);
        setConfirmOpen(false);
        setParts([]);
        setGcode(undefined);
    }, [printer?.selectedPrinter.id]);

    console.log(printer?.selectedPrinter.name, printer?.live);
    const temptest = Boolean(printer?.temperature && printer?.temperature >= 195);
    return (
        <div className={styles.App}>
            <Navbar fixedToTop>
                <Navbar.Group>
                    <Navbar.Heading>PrintAssist</Navbar.Heading>
                </Navbar.Group>
            </Navbar>
            <div className={styles['content-wrapper']}>
                <div style={{ flex: 3, display: 'flex' }}>
                    <PrinterSettingsCard />
                </div>
                <div style={{ flex: 9, display: 'flex' }}>
                    <div className={styles.content}>
                        <Card elevation={2} className={styles['part-select-card']}>
                            <h2
                                style={{
                                    marginTop: 0,
                                    marginBottom: 20,
                                }}
                            >
                                Drucken auf: {printer?.selectedPrinter.name}
                            </h2>
                            {!printer?.live && (
                                <Text>
                                    Schalte den Drucker ein um zu drucken oder wähle einen anderen
                                    Drucker!
                                </Text>
                            )}
                            {printer?.live && (
                                <>
                                    <>
                                        <div>
                                            <PartSelect
                                                onPartAdded={(part) => {
                                                    {
                                                        if (
                                                            includes(map(parts, 'name'), part.name)
                                                        ) {
                                                            const p = remove(
                                                                parts,
                                                                (p) =>
                                                                    p.name.toLowerCase() ==
                                                                    part.name.toLowerCase()
                                                            )[0];
                                                            setParts([
                                                                ...parts,
                                                                { ...p, count: p.count + 1 },
                                                            ]);
                                                        } else {
                                                            setParts([
                                                                ...parts,
                                                                { ...part, count: 1 },
                                                            ]);
                                                        }
                                                    }
                                                }}
                                            />
                                        </div>
                                    </>
                                    {Boolean(parts.length) && (
                                        <>
                                            <Divider style={{ margin: 24 }} />
                                            <div>
                                                <PartList
                                                    parts={parts}
                                                    handlers={{
                                                        remove: (p) =>
                                                            setParts(
                                                                filter(parts, (v) => !isEqual(v, p))
                                                            ),
                                                        count: (p, c) => {
                                                            const i = parts.indexOf(p);
                                                            parts[i] = { ...parts[i], count: c };
                                                            setParts([...parts]);
                                                        },
                                                    }}
                                                />
                                            </div>
                                            <Divider style={{ margin: 24 }} />
                                        </>
                                    )}
                                    {Boolean(parts.length) && (
                                        <div>
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
                                                        <div className={styles['info-wrapper']}>
                                                            <div className={styles['info-item']}>
                                                                <h3>Zeit:</h3>
                                                                <p>
                                                                    {moment
                                                                        .duration(
                                                                            extractDataFromGcode(
                                                                                gcode
                                                                            ).time,
                                                                            's'
                                                                        )
                                                                        .humanize()}
                                                                </p>
                                                            </div>
                                                            <div className={styles['info-item']}>
                                                                <h3>Gewicht:</h3>
                                                                <p>
                                                                    {extractDataFromGcode(
                                                                        gcode
                                                                    ).weight.toFixed(2)}
                                                                    g
                                                                </p>
                                                            </div>
                                                            <div className={styles['info-item']}>
                                                                <h3>Preis:</h3>
                                                                <p>
                                                                    {extractDataFromGcode(
                                                                        gcode
                                                                    ).price.toFixed(2)}
                                                                    €
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <GcodePreview gcode={gcode} />
                                                        <ButtonGroup
                                                            vertical={!isMobile}
                                                            large
                                                            className={styles['button-group']}
                                                        >
                                                            <AnchorButton
                                                                icon="download"
                                                                href={
                                                                    'data:text/plain;charset=utf-8,' +
                                                                    encodeURIComponent(
                                                                        gcode as string
                                                                    )
                                                                }
                                                                download={'print.gcode'}
                                                            >
                                                                Herunterladen
                                                            </AnchorButton>
                                                            <Button
                                                                icon="print"
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
                                        </div>
                                    )}
                                </>
                            )}
                        </Card>
                    </div>
                </div>
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
