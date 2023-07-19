import classNames from 'classnames';
import styles from './gcode-preview.module.scss';
import Viewer from './viewer';
import { useEffect, useRef } from 'react';
import { usePrinter } from '../../contexts/contextHooks';
type GCodePreviewHandle = React.ElementRef<typeof Viewer>;

export interface GcodePreviewProps {
    className?: string;
    gcode?: string;
}

/**
 * This component was created using Codux's Default new component template.
 * To create custom component templates, see https://help.codux.com/kb/en/article/kb16522
 */
export const GcodePreview = ({ className, gcode }: GcodePreviewProps) => {
    if (!gcode) return null;
    const ref = useRef<GCodePreviewHandle | null>(null);
    const printer = usePrinter();
    useEffect(() => {
        if (ref.current && gcode) {
            ref.current.processGCode(gcode);
        }
    }, [gcode]);

    return (
        <div style={{ height: '100%', minWidth: 400 }}>
            <Viewer gcode={gcode}></Viewer>
        </div>
    );
};
