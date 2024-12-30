import { Card, InputGroup, Slider } from '@blueprintjs/core';
import { filter, find, set, startCase } from 'lodash';
import React from 'react';
import partList from '../../../part-list.json';

const NameStudio: React.FC = () => {
    const [size, setSize] = React.useState(4);
    const [name, setName] = React.useState('');

    return (
        <div className="w-full  flex-row flex">
            <div className="basis-1/2 flex-grow flex-shrink">
                <h2>Form auswählen</h2>
                <div className="flex flex-row w-full flex-wrap">
                    {filter(partList.parts, { size: 'name' }).map((p, i) => {
                        const img = p?.custom?.icon ?? find(partList.groups, { id: p.group })?.icon;

                        return (
                            <>
                                <Card
                                    key={i}
                                    className="relative aspect-square h-32 !p-2  justify-center content-center"
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
            </div>
        </div>
    );
};

export default NameStudio;
