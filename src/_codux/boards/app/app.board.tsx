import { createBoard } from '@wixc3/react-board';
import App from '../../../App';

export default createBoard({
    name: 'App',
    Board: () => <App />,
    environmentProps: {
        canvasHeight: 784,
        canvasWidth: 1148,
        windowHeight: 822,
        windowWidth: 1180,
    },
});
