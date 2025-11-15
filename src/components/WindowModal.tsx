import { ArrowsInIcon, ArrowsOutIcon, X } from '@phosphor-icons/react';
import { useEffect, useRef, useState } from 'react';
import { Rnd } from 'react-rnd';


type Props = {
    title?: string;
    initialWidth?: number;
    initialHeight?: number;
    children: React.ReactNode;
    onClose: () => void;
    onActivate: () => void;
    isFocused: boolean;
    zIndex: number;
};

export default function WindowModal({ title, initialHeight = 500, initialWidth = 750, children, onClose, onActivate, zIndex }: Props) {
    const [isMaximized, setIsMaximized] = useState(false);
    const [x, setX] = useState(0);
    const [y, setY] = useState(0);
    const [width, setWidth] = useState(initialWidth);
    const [height, setHeight] = useState(initialHeight);
    const [prevSizeAndPosition, setPrevSizeAndPosition] = useState({ x: 0, y: 0, width: 750, height: 500 });
    const nodeRef = useRef(null);

    const toggleMaximize = () => {
        if (isMaximized) {
            setWidth(prevSizeAndPosition.width);
            setHeight(prevSizeAndPosition.height);
            setX(prevSizeAndPosition.x);
            setY(prevSizeAndPosition.y);
        } else {
            setPrevSizeAndPosition({ x, y, width, height });
            const margin = 16;
            setWidth(window.innerWidth - 2 * margin);
            setHeight(window.innerHeight - 41 - 2 * margin);
            setX(margin);
            setY(margin);
        }
        setIsMaximized(!isMaximized);
    };

    useEffect(() => {
        const handleResize = () => {
            if (isMaximized) {
                const margin = 50;
                setWidth(window.innerWidth - 2 * margin);
                setHeight(window.innerHeight - 2 * margin);
                setX(margin);
                setY(margin);
            }
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [isMaximized]);

    return (
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex }} onMouseDown={onActivate}>
            <Rnd
                ref={nodeRef}
                size={{ width: width, height: height }}
                position={{ x: x, y: y }}
                minWidth={400}
                minHeight={400}
                maxWidth={window.innerWidth}
                maxHeight={window.innerHeight}
                onDragStop={(e, d) => {
                    setX(d.x);
                    setY(d.y);
                }}
                onResizeStop={(e, direction, ref, delta, position) => {
                    setWidth(ref.offsetWidth);
                    setHeight(ref.offsetHeight);
                    setX(position.x);
                    setY(position.y);
                }}
                disableDragging={isMaximized}
                enableResizing={!isMaximized}
                className={`absolute border border-black rounded-xl shadow-xl pointer-events-auto opacity-96 bg-white ${isMaximized ? 'inset-0 w-full h-full rounded-none' : ''}`}
                onMouseDown={(e) => {
                    e.stopPropagation();
                    onActivate();
                }}
            >
                {title &&
                    <div className="gap-2 flex justify-between border-b-1 border-black p-3 modal-title">
                        <span className='font-bold whitespace-nowrap overflow-hidden text-ellipsis' title={title}>{title}</span>
                        <div className="flex gap-2">
                            <button className="cursor-pointer" onClick={toggleMaximize}>
                                {isMaximized ? <ArrowsInIcon size={20} /> : <ArrowsOutIcon size={20} />}
                            </button>
                            <button className="cursor-pointer" onClick={onClose}><X size={20} /></button>
                        </div>
                    </div>}
                <div className="w-full h-full p-4 flex justify-center" style={{ maxHeight: height - 49 }}>{children}</div>
            </Rnd>
        </div>
    );
}