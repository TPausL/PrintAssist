import { Button, Card, InputGroup, Slider } from '@blueprintjs/core';
import { filter, find, set, startCase } from 'lodash';
import React, { useEffect, useRef } from 'react';
import partList from '../../../part-list.json';
import { usePrinter, useSlicer } from '../../contexts/contextHooks';

const NameStudio: React.FC = () => {
    const parts = filter(partList.parts, { size: 'name' });
    const [size, setSize] = React.useState(4);
    const [name, setName] = React.useState('Timo');
    const [shape, setShape] = React.useState(1);
    const [valid, setValid] = React.useState(false);

    const { render, slice } = useSlicer() ?? {};
    const { print } = usePrinter() ?? {};
    const [loading, setLoading] = React.useState(false);

    useEffect(() => {
        setValid(name.length > 0 && shape >= 0);
    }, [name, shape]);

    const onConfirm = async () => {
        setLoading(true);
        try {
            if (!render) return;
            const res = await render(parts[shape].file, { size, name });
            const stlPath = res.stlPath;
            if (!slice) return;
            const sliceRes = await slice(
                [{ file: stlPath, name: parts[shape].name, count: 1 }],
                undefined,
                { height: 0.05 * size * 10 + 1.5 + 0.1 }
            );
            if (!print) return;
            print(sliceRes);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full  flex-row flex">
            <div className="basis-1/2 flex-grow flex-shrink">
                <h2>Form auswählen</h2>
                <div className="flex flex-row w-full flex-wrap">
                    {parts.map((p, i) => {
                        const img = p?.custom?.icon ?? find(partList.groups, { id: p.group })?.icon;
                        console.log(shape == i ? 'bg-blue-100' : 'bg-white');
                        return (
                            <>
                                <Card
                                    key={i}
                                    className={`relative aspect-square h-32 !p-2  justify-center content-center hover:shadow-lg cursor-pointer ${
                                        shape == i ? '!bg-gray-100' : '!bg-white'
                                    }`}
                                    onClick={() => {
                                        setShape(i);
                                    }}
                                >
                                    {img && (
                                        <img
                                            height={'90%'}
                                            width={'90%'}
                                            src={img}
                                            alt={`${p.name} icon`}
                                            className="absolute top-1/2 left-1/2 opacity-10 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none object-contain"
                                        />
                                    )}
                                    <h3 className="text-lg font-semibold text-gray-800 text-center flex items-center justify-center">
                                        {startCase(p.name)}
                                    </h3>
                                </Card>
                            </>
                        );
                    })}
                </div>
            </div>
            <div className="basis-1/2 flex-grow flex-shrink flex flex-col">
                <h2>Größe auswählen</h2>
                <div className="px-10 h-fit flex">
                    <Slider min={3} max={7} value={size} onChange={setSize} intent="none"></Slider>
                </div>
                <h2>Namen eingeben</h2>
                <InputGroup
                    onChange={(e) => setName(e.target.value)}
                    large
                    value={name}
                    placeholder="Name..."
                    leftIcon="person"
                ></InputGroup>
                {valid && (
                    <Button className="mt-3 self-end justify-self-end" onClick={onConfirm}>
                        Drucken
                    </Button>
                )}
            </div>
        </div>
    );
};

export default NameStudio;
