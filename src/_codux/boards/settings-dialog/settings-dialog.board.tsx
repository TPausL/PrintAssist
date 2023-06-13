import { createBoard } from '@wixc3/react-board';
import { SettingsDialog } from '../../../components/settings-dialog/settings-dialog';

export default createBoard({
    name: 'SettingsDialog',
    Board: () => <SettingsDialog />
});
