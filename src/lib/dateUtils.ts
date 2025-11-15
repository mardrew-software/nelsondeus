import { FileNode, Folder } from '@/types';

export const getEffectiveDate = (item: FileNode | Folder, type: 'file' | 'folder'): Date => {
    if (type === 'file') {
        return new Date((item as FileNode).date);
    } else {
        const folder = item as Folder;
        const allDates: Date[] = [];

        // Get dates from files directly within this folder
        folder.files.forEach(file => allDates.push(new Date(file.date)));

        // Recursively get dates from subfolders
        const getDatesFromSubfolders = (sub: Folder) => {
            sub?.files?.forEach(file => allDates.push(new Date(file.date || 0)));
            sub?.subfolders?.forEach(s => getDatesFromSubfolders(s));
        };
        folder?.subfolders?.forEach(sub => getDatesFromSubfolders(sub));

        if (allDates.length > 0) {
            return new Date(Math.max(...allDates.map(date => date.getTime())));
        }
        // Fallback for empty folders or folders with no dated files
        return new Date(0); // Return a very old date
    }
};