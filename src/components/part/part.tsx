import classNames from 'classnames';
import styles from './part.module.scss';
import { ListPart, PartType } from '../../types';
import { Button, Icon, NumericInput } from '@blueprintjs/core';
import { useState } from 'react';
import { PartListProps } from '../part-list/part-list';
import { startCase } from 'lodash';
import moment from 'moment';
import { useMediaQuery } from 'react-responsive';

export interface PartProps {
    className?: string;
    data: ListPart;
    handlers: PartListProps['handlers'];
}

/**
 * This component was created using Codux's Default new component template.
 * To create custom component templates, see https://help.codux.com/kb/en/article/kb16522
 */
export const Part = ({ className, data, handlers }: PartProps) => {
    const isMobile = useMediaQuery({ query: '(max-width: 1224px)' });

    return (
        <div className={classNames(styles.root, className, styles['part-list-item'])}>
            <h3 className={classNames(styles['part-list-item-name'])}>{startCase(data.name)}</h3>
            <NumericInput
                leftIcon="array-numeric"
                large={true}
                intent="primary"
                type="number"
                className={styles.input}
                min={1}
                value={data.count}
                onValueChange={(c) => handlers.count(data, c)}
            />
            {!isMobile && <>
            <p style={{ width: 80 }}>{moment.duration(data.count * data.time, 's').humanize()}</p>
            <p style={{ width: 80 }}>{(data.count * data.weight).toFixed(2)}g</p></>}
            <Button minimal text={isMobile ? undefined: "Entfernen"} icon={'cross'} onClick={() => handlers.remove(data)} />
        </div>
    );
};
