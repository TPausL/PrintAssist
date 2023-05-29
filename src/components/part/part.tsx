import classNames from 'classnames';
import styles from './part.module.scss';
import { ListPart, PartType } from '../../types';
import { Button, Icon, NumericInput } from '@blueprintjs/core';
import { useState } from 'react';
import { PartListProps } from '../part-list/part-list';

export interface PartProps {
    className?: string;
    data: ListPart;
    handlers: PartListProps["handlers"]
}

/**
 * This component was created using Codux's Default new component template.
 * To create custom component templates, see https://help.codux.com/kb/en/article/kb16522
 */
export const Part = ({ className, data, handlers }: PartProps) => {
    console.log(data.count)
    const [count, setCount] = useState<number>(1);
    return (
        <div className={classNames(styles.root, className, styles['part-list-item'])}>
            <h3 className={classNames(styles['part-list-item-name'])}>{data.name}</h3>
            <NumericInput
                leftIcon="array-numeric"
                large={true}
                intent="primary"
                type="number"
                className={styles.input}
                min={1}
                value={data.count}
                onValueChange={(c) => handlers.count(data,c)}
            />
            <Icon icon={"cross"} onClick={() => handlers.remove(data)} />
        </div>
    );
};
