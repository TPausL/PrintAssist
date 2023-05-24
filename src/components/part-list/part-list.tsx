import classNames from 'classnames';
import styles from './part-list.module.scss';
import { Part } from '../part/part';
import { PartType } from '../../types';

export interface PartListProps {
    className?: string;
    parts: PartType[];
    
}



/**
 * This component was created using Codux's Default new component template.
 * To create custom component templates, see https://help.codux.com/kb/en/article/kb16522
 */
export const PartList = ({ className, parts  }: PartListProps) => {

    const genParts = () => {
        return parts.map((p,i) => (<Part data={p} key={i} />))
    }
    console.log(genParts());
    return (
        <div className={classNames(styles.root, className)}>
            <ul>
            {parts.map((p,i) => (<Part data={p} key={i} />))}
            </ul>
        </div>
    );
};
