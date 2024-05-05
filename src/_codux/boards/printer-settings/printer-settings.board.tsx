import { createBoard } from '@wixc3/react-board';
import { PrinterSettings } from '../../../components/printer-settings/printer-settings';

export default createBoard({
    name: 'PrinterSettings',
    Board: () => <PrinterSettings />,
    isSnippet: true,
});