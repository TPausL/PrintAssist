import { createBoard } from '@wixc3/react-board';
import { GcodePreview } from '../../../components/gcode-preview/gcode-preview';

export default createBoard({
    name: 'GcodePreview',
    Board: () => <GcodePreview />
});
