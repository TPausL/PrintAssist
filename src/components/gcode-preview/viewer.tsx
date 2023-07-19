import * as GCodePreview from 'gcode-preview';
import { forwardRef, Ref, useEffect, useImperativeHandle, useRef, useState } from 'react';
import * as THREE from 'three';

interface GCodePreviewProps {
    topLayerColor?: string;
    lastSegmentColor?: string;
    startLayer?: number;
    endLayer?: number;
    lineWidth?: number;
    gcode?: string;
}

interface GCodePreviewHandle {
    getLayerCount: () => number;
    processGCode: (gcode: string | string[]) => void;
}

function GCodePreviewUI(props: GCodePreviewProps, ref: Ref<GCodePreviewHandle>): JSX.Element {
    const {
        topLayerColor = '',
        lastSegmentColor = '',
        startLayer,
        endLayer,
        lineWidth,
        gcode,
    } = props;
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [preview, setPreview] = useState<GCodePreview.WebGLPreview>();

    const resizePreview = () => {
        preview?.resize();
    };

    useImperativeHandle(ref, () => ({
        getLayerCount() {
            return preview?.layers.length as number;
        },
        processGCode(gcode) {
            preview?.processGCode(gcode);
        },
    }));

    useEffect(() => {
        if (!gcode) return;
        preview?.clear();
        preview?.processGCode(gcode);
        if (preview?.startLayer) preview.startLayer = 4;
    }, [gcode, preview]);

    useEffect(() => {
        setPreview(
            GCodePreview.init({
                canvas: canvasRef.current as HTMLCanvasElement,
                startLayer,
                endLayer,
                lineWidth,
                topLayerColor: new THREE.Color(topLayerColor).getHex(),
                lastSegmentColor: new THREE.Color(lastSegmentColor).getHex(),
                //buildVolume: { x: 250, y: 220, z: 150 },
                initialCameraPosition: [0, 400, 0],
                allowDragNDrop: false,
            })
        );

        //window.addEventListener('resize', resizePreview);

        return () => {
            //window.removeEventListener('resize', resizePreview);
        };
    }, []);

    return <canvas style={{}} height={500} width={500} ref={canvasRef}></canvas>;
}

export default forwardRef(GCodePreviewUI);
