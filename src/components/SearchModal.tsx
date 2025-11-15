'use client';

import { RefObject } from 'react';
import { ExplorerClientHandle } from './ExplorerClient';
import { FileNode, Folder } from '@/types';
import { getEffectiveDate } from '@/lib/dateUtils';

type SearchModalProps = {
    onClose: () => void;
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    filteredItems: (FileNode & { isFolder: boolean } | Folder & { isFolder: boolean })[];
    explorerRef: RefObject<ExplorerClientHandle | null>;
    setOpenSearch: (open: boolean) => void;
};

export default function SearchModal({
    onClose,
    searchTerm,
    setSearchTerm,
    filteredItems,
    explorerRef,
    setOpenSearch,
}: SearchModalProps) {
    return (
        <div className="fixed inset-0 flex justify-center items-center z-[9999]" onClick={onClose}>
            <div
                className="absolute w-[min(760px,90vw)] max-h-[80vh] bg-[var(--window)] border border-[var(--border)] rounded-xl shadow-xl pointer-events-auto backdrop-blur-md flex flex-col"
                onMouseDown={(e) => e.stopPropagation()}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="modal-content flex-1 overflow-hidden">
                    <div className='p-4'>
                        <input
                            type="text"
                            placeholder="Search ..."
                            className="w-full p-2 border rounded mb-2"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            autoFocus
                        />
                        <div className="h-fit max-h-80 overflow-y-auto">
                            {filteredItems.length > 0 ? (
                                filteredItems
                                    .sort((a, b) => {
                                        const dateA = getEffectiveDate(a, a.isFolder ? 'folder' : 'file').getTime();
                                        const dateB = getEffectiveDate(b, b.isFolder ? 'folder' : 'file').getTime();
                                        return dateB - dateA; // Descending order
                                    })
                                    .map((item) => {
                                        const prefix = !item?.isFolder ? `${(item as FileNode).folder?.name || ''}` : '';
                                        return <div
                                            key={item.id}
                                            className="flex flex-row justify-between items-center p-2 hover:bg-stone-100 cursor-pointer rounded"
                                            onClick={() => {
                                                explorerRef.current?.openItem(
                                                    item.isFolder
                                                        ? { type: 'folder', node: item as Folder }
                                                        : { type: 'file', node: item as FileNode }
                                                );
                                                setOpenSearch(false);
                                            }}
                                        >
                                            <div className="font-medium">{prefix ? `${prefix} / ` : ''}{item.name}</div>
                                            {!item.isFolder &&
                                                <div className="bg-stone-100 p-1 px-2 rounded text-xs text-stone-500">
                                                    {(item as FileNode).type}
                                                </div>}
                                        </div>
                                    })
                            ) : (
                                <div className="text-center">
                                    {searchTerm ? 'No results found' : 'Start typing to search...'}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}