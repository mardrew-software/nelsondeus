'use client';

import { useCallback, useRef, useState, forwardRef, useImperativeHandle, useMemo } from 'react';
import Draggable, { DraggableBounds } from 'react-draggable';
import { FileNode, Folder, Settings } from '@/types';
import WindowModal from './WindowModal';
import FileContent from './FileContent';
import FolderContent from './FolderContent';
import ExplorerIcon from './ExplorerIcon';
import { getEffectiveDate } from '@/lib/dateUtils';

type Props = {
    settings: Settings | null;
    rootFolders: Folder[];
    rootFiles: FileNode[];
};

type WindowItem = { type: 'file' | 'folder'; node: FileNode | Folder }

export type ExplorerClientHandle = {
    openItem: (item: WindowItem) => void;
};

const getItemId = ({ type, node }: { type: 'file' | 'folder'; node: FileNode | Folder }) =>
    `${type}:${node.id}`;


export default forwardRef<ExplorerClientHandle, Props>(function ExplorerClient({ rootFolders, rootFiles }: Props, ref) {
    const [openWindows, setOpenWindows] = useState<WindowItem[]>([]);
    const containerRef = useRef<HTMLDivElement | null>(null);

    const allSortedItems = useMemo(() => {
        const allItems = [
            ...rootFiles.map(node => ({ node, type: 'file' as const })),
            ...rootFolders.map(node => ({ node, type: 'folder' as const })),
        ];

        return allItems.sort((a, b) => {
            const dateA = getEffectiveDate(a.node, a.type).getTime();
            const dateB = getEffectiveDate(b.node, b.type).getTime();
            return dateB - dateA; // Descending order
        });
    }, [rootFiles, rootFolders]);

    const onOpen = useCallback((item: WindowItem) => {
        const newItemId = getItemId(item);
        setOpenWindows(w => {
            const existingIndex = w.findIndex(openItem => getItemId(openItem) === newItemId);
            if (existingIndex !== -1) {
                const updated = [...w];
                const [toFront] = updated.splice(existingIndex, 1);
                return [...updated, toFront];
            }
            return [...w, item];
        });
    }, []);

    const onCloseById = useCallback((id: string) => {
        setOpenWindows(w => w.filter(win => getItemId(win) !== id));
    }, []);

    const onFocusById = useCallback((id: string) => {
        setOpenWindows(w => {
            const idx = w.findIndex(win => getItemId(win) === id);
            if (idx === -1) return w;
            const updated = [...w];
            const [toFront] = updated.splice(idx, 1);
            return [...updated, toFront];
        });
    }, []);

    useImperativeHandle(ref, () => ({
        openItem: (item: WindowItem) => onOpen(item),
    }), [onOpen]);

    const calculateInitialWindowSize = useCallback((item: WindowItem) => {
        let initialWidth = 750;
        let initialHeight = 500;

        if (item.type === 'file' && (item.node as FileNode).media) {
            const mediaWidth = (item.node as FileNode).media?.width ?? 0;
            const mediaHeight = (item.node as FileNode).media?.height ?? 0;

            if (mediaWidth > 0 && mediaHeight > 0) {
                const aspectRatio = mediaWidth / mediaHeight;

                if (mediaWidth > 750 && mediaHeight > 500) {
                    const widthRatio = mediaWidth / 750;
                    const heightRatio = mediaHeight / 500;

                    if (widthRatio > heightRatio) {
                        initialWidth = 750;
                        initialHeight = 750 / aspectRatio;
                    } else {
                        initialHeight = 500;
                        initialWidth = 500 * aspectRatio;
                    }
                } else if (mediaWidth > 750) {
                    initialWidth = 750;
                    initialHeight = 750 / aspectRatio;
                } else if (mediaHeight > 500) {
                    initialHeight = 500;
                    initialWidth = 500 * aspectRatio;
                } else {
                    initialWidth = mediaWidth;
                    initialHeight = mediaHeight;
                }
            }
        }
        return { initialWidth, initialHeight };
    }, []);

    const renderIcon = (node: FileNode | Folder, type: 'file' | 'folder') => {
        const id = getItemId({ type: type, node });
        const nodeRef = useRef(null);
        const dragStartTimeRef = useRef(0);

        return (
            <Draggable
                key={id}
                onStop={(event, data) => {
                    const dragDuration = Date.now() - dragStartTimeRef.current;
                    if (dragDuration < 200) { // 200ms threshold for a click
                        onOpen({ type: type, node: node });
                    }
                }}
                onStart={() => {
                    dragStartTimeRef.current = Date.now();
                }}
                nodeRef={nodeRef}
                bounds={(containerRef.current ? containerRef.current as DraggableBounds : undefined)}
            >
                <div ref={nodeRef}>
                    <ExplorerIcon
                        name={node.name}
                        iconUrl={node.icon?.url}
                        mediaUrl={type === 'file' ? (node as FileNode).media?.url : undefined}
                        type={type === 'file' ? (node as FileNode).type : 'FOLDER'}
                    />
                </div>
            </Draggable>
        );
    };

    return (
        <div ref={containerRef} className="relative h-dvh overflow-hidden">
            <div className="m-4 relative w-full h-full flex flex-row flex-wrap gap-4">
                {allSortedItems.map(({ node, type }) => renderIcon(node, type))}
            </div>

            {openWindows.map((item, idx) => {
                const id = getItemId(item);
                const { initialWidth, initialHeight } = calculateInitialWindowSize(item);

                return (
                    <WindowModal
                        key={id}
                        initialHeight={initialHeight}
                        initialWidth={initialWidth}
                        title={item.node.name}
                        onClose={() => onCloseById(id)}
                        onActivate={() => onFocusById(id)}
                        zIndex={100 + idx}
                        isFocused={idx === openWindows.length - 1}
                    >
                        {item.type === 'file' ? (
                            <FileContent file={item.node as FileNode} />
                        ) : (
                            <FolderContent folder={item.node as Folder} onOpenItem={onOpen} />
                        )}
                    </WindowModal>
                );
            })}
        </div >
    );
})