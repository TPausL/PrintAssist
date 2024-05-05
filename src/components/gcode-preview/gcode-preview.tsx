import classNames from 'classnames';
import styles from './gcode-preview.module.scss';
import Viewer from './viewer';
import { useEffect, useRef } from 'react';
import { usePrinter } from '../../contexts/contextHooks';
import { compact, isEqual, map, max, min } from 'lodash';

export interface GcodePreviewProps {
    className?: string;
    gcode?: string;
}
class GCodeCommand {
    constructor(public command: string, public parameters: { [key: string]: number }) {}
}

/**
 * This component was created using Codux's Default new component template.
 * To create custom component templates, see https://help.codux.com/kb/en/article/kb16522
 */
export const GcodePreview = ({ className, gcode }: GcodePreviewProps) => {
    if (!gcode) return null;
    const printer = usePrinter();

    function parseGCode(gcode: string): GCodeCommand[] {
        const lines = gcode.split('\n');
        const commands: GCodeCommand[] = [];

        for (const line of lines) {
            const [command, ...params] = line.split(' ');

            if (command.startsWith(';')) {
                if (command == ';LAYER_CHANGE') {
                    commands.push(new GCodeCommand('LAYER_CHANGE', {}));
                }
                continue; // Skip comments
            }

            const parameters: { [key: string]: number } = {};
            for (const param of params) {
                const [key, value] = param.split(/([A-Z]+)/).filter(Boolean);
                parameters[key] = parseFloat(value);
            }

            commands.push(new GCodeCommand(command, parameters));
        }

        return commands;
    }

    function extractSecondLayer(gcode: GCodeCommand[]): GCodeCommand[] {
        let layer = 0;
        const secondLayerGCode: GCodeCommand[] = [];

        for (const command of gcode) {
            if (command.command === 'LAYER_CHANGE') {
                layer++;
            }

            if (layer === 4) {
                secondLayerGCode.push(command);
            }

            if (layer > 4) {
                break;
            }
        }

        return secondLayerGCode;
    }

    function GenerateSVGFromGCode(gcodeCommands: GCodeCommand[]) {
        const svgPaths: string[] = [];
        let currentPosition: { x: number; y: number } = { x: 0, y: 0 };
        let offset = { x: 0, y: 0 };

        const x_min = min(compact(map(gcodeCommands, 'parameters.X')));
        const y_min = min(compact(map(gcodeCommands, 'parameters.Y')));
        const x_max = max(compact(map(gcodeCommands, 'parameters.X')));
        const y_max = max(compact(map(gcodeCommands, 'parameters.Y')));

        for (const command of gcodeCommands) {
            if (command.command === 'G1' || command.command === 'G0') {
                if (command.parameters.X && command.parameters.Y) {
                    if (isEqual(offset, { x: 0, y: 0 })) {
                        offset = { x: command.parameters.X / 2, y: command.parameters.Y / 2 };
                    }
                    const x = command.parameters.X ?? currentPosition.x;
                    const y = command.parameters.Y ?? currentPosition.y;
                    if (command.parameters?.E > 0) {
                        svgPaths.push(
                            `M ${currentPosition.x - x_min - 2},${
                                currentPosition.y - y_min - 2
                            } L ${x - x_min - 2},${y - y_min - 2}`
                        );
                    } else {
                        svgPaths.push(
                            `M ${currentPosition.x - x_min - 2},${currentPosition.y - y_min - 2}`
                        );
                    }
                    currentPosition = { x, y };
                }
            }
        }

        //rotate(180, ${x_max / 2}, ${y_max / 2})
        //transform={`translate(-${x_offset -2} -${y_offset-2}) rotate(180, ${x_max / 2}, ${y_max / 2})`}
        //viewBox={`0 0 ${x_max} ${y_max}`} width={x_max +2} height={y_max + 2}
        const svg_padding = 4;
        return (
            <svg
                style={{ transform: 'rotate(180deg)' }}
                xmlns="http://www.w3.org/2000/svg"
                viewBox={`-${svg_padding} -${svg_padding} ${x_max - x_min + svg_padding} ${
                    y_max - y_min + svg_padding
                }`}
                height="200"
            >
                <path strokeWidth={0.3} fill="none" stroke={'black'} d={`${svgPaths.join(' ')}`} />
            </svg>
        );
    }
    return <div>{GenerateSVGFromGCode(extractSecondLayer(parseGCode(gcode)))}</div>;
};
