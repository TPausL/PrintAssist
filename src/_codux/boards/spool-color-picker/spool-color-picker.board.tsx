import { createBoard } from '@wixc3/react-board';
import { SpoolColorPicker } from '../../../components/spool-color-picker/spool-color-picker';

export default createBoard({
    name: 'SpoolColorPicker',
    Board: () => <SpoolColorPicker />,
});
