import { createBoard } from '@wixc3/react-board';
import App from '../../../App';

export default createBoard({
    name: 'App',
    Board: () => <App />,
    environmentProps: {
        canvasHeight: 784,
        canvasWidth: 1148,
        windowWidth: 1024,
        windowHeight: 768,
    },
});
