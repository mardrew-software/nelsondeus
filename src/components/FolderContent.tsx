'use client';

import { FileNode, Folder } from '@/types';
import ExplorerIcon from './ExplorerIcon';

type FolderContentProps = {
    folder: Folder;
    onOpenItem: (item: { type: 'file' | 'folder'; node: FileNode | Folder }) => void;
}

export default function FolderContent({ folder, onOpenItem }: FolderContentProps) {
    const files = folder.files ? [...folder.files].sort((a, b) => {
        const dateA = new Date(a.date || 0).getTime();
        const dateB = new Date(b.date || 0).getTime();
        return dateA - dateB;
    }) : [];
    return (
        <>
            {
                <div className="flex flex-row flex-wrap gap-4 overflow-y-auto h-full w-full">
                    {(folder?.subfolders || []).map((f) => {
                        return (
                            <div key={f.id} onClick={() => onOpenItem({ type: 'folder', node: f })}>
                                <ExplorerIcon name={f.name} type='FOLDER' iconUrl={''} />
                            </div>
                        );
                    })}
                    {files.map((f) => {
                        return (
                            <div key={f.id} onClick={() => onOpenItem({ type: 'file', node: f })}>
                                <ExplorerIcon
                                    name={f.name}
                                    showName={f.showName}
                                    type={f.type}
                                    iconUrl={f.icon?.url}
                                />
                            </div>
                        );
                    })}
                </div>}</>
    );
}