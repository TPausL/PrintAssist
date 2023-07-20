import classNames from 'classnames';
import { Card, Divider, Icon, MenuItem, Text } from '@blueprintjs/core';
import moment from 'moment';
import { ItemRenderer, ItemRendererProps } from '@blueprintjs/select';
import { PartType } from '../../types';
import { startCase, upperFirst } from 'lodash';
import PartSelectItem_module from './part-select-item.module.scss';
import partList from '../../../part-list.json';
import React from 'react';
export type PartSelectItemProps = {
    className?: string;
    size: 'klein' | 'mittel' | 'groß';
    onPartAdded: (part: PartType) => void;
};

const SVG = ({ group }: { group: string }) => {
    const SvgIcon = require(`../../assets/${group}.svg`);
    return <SvgIcon />;
};

/**
 * This component was created using Codux's Default new component template.
 * To create custom component templates, see https://help.codux.com/kb/en/article/kb16522
 */
export const PartSelectItem = ({ className, size, onPartAdded }: PartSelectItemProps) => {
    const parts = partList.parts.filter((part) => part.size == size);
    return (
        <React.Fragment key={size} >
            {parts.map((p, i) => (
                <Card
                key={i}
                    onClick={() => onPartAdded(p)}
                    interactive
                    elevation={1}
                    className={PartSelectItem_module['part-wrapper']}
                >
                    <img
                        className={PartSelectItem_module['icon']}
                        src={`/${p.group}.svg`}
                        height={'95%'}
                        width={'95%'}
                    />

                    <h3>{startCase(p.name.split(' ')[1])}</h3>
                    <p>{p.price.toFixed(2)}€</p>
                    <p>{moment.duration(p.time, 's').humanize()}</p>
                    <p>{p.weight}g</p>
                </Card>
            ))}
        </React.Fragment>
    );
};
