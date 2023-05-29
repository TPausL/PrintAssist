import classNames from 'classnames';
import styles from './part-list.module.scss';
import { Part } from '../part/part';
import { ListPart, PartType } from '../../types';


export interface PartListProps {
    className?: string;
    parts: ListPart[];
    handlers: {
        remove: (p: ListPart) => void;
        count: (p : ListPart, c: number) => void;
    }
    
}



/**
 * This component was created using Codux's Default new component template.
 * To create custom component templates, see https://help.codux.com/kb/en/article/kb16522
 */
export const PartList = ({ className, parts, handlers  }: PartListProps) => {

    return (
        <div className={classNames(styles.root, className)}>
            <ul>
            {parts.map((p,i) => (<Part data={p} key={i} handlers={handlers} />))}
            </ul>
        </div>
    );
};
