'use client';

import { useEffect, useState, useMemo, useRef } from 'react';
import ExplorerClient, { ExplorerClientHandle } from '@/components/ExplorerClient';
import { hygraph } from '@/lib/hygraph';
import { GET_EXPLORER_DATA } from '@/graphql/queries';
import { FileNode, Folder, Settings } from '@/types';
import { SpinnerIcon } from '@phosphor-icons/react';
import SearchModal from '@/components/SearchModal';
import TopBar from '@/components/TopBar';

interface ExplorerData {
  settings: Settings | null;
  rootFolders: Folder[];
  rootFiles: FileNode[];
}

export default function Page() {
  const [data, setData] = useState<ExplorerData | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const explorerRef = useRef<ExplorerClientHandle | null>(null);
  const [openSearch, setOpenSearch] = useState<boolean>(false);

  const allSearchableItems = useMemo(() => {
    if (!data) return [];

    const allFiles: (FileNode & { isFolder: boolean })[] = [];

    const extractFiles = (folders: Folder[]) => {
      folders.forEach(folder => {
        folder.files.forEach(file => allFiles.push({ ...file, isFolder: false }));
        if (folder.subfolders) {
          extractFiles(folder.subfolders as Folder[]);
        }
      });
    };

    extractFiles(data.rootFolders);

    const foldersWithFlag = data.rootFolders.map(folder => ({ ...folder, isFolder: true }));
    const filesWithFlag = data.rootFiles.map(file => ({ ...file, isFolder: false }));

    return [...foldersWithFlag, ...filesWithFlag, ...allFiles];
  }, [data]);

  const filteredItems = useMemo(() => {
    if (!searchTerm) return allSearchableItems;
    return allSearchableItems.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, allSearchableItems]);

  useEffect(() => {
    (async () => {
      try {
        const res = await hygraph.request<any>(GET_EXPLORER_DATA);

        const settings: Settings | null = res?.settings?.[0] ?? null;
        const allFolders: Folder[] = res?.folders ?? [];
        const allFiles: FileNode[] = res?.files ?? [];

        // Filter root folders (those without parent)
        const rootFolders = allFolders.filter(folder => !folder.parent);
        // Filter root files (those without folder)
        const rootFiles = allFiles.filter(file => !file.folder);
        console.log(allFiles);

        setData({
          settings,
          rootFolders,
          rootFiles
        });
      } catch (e) {
        console.error('Error fetching data:', e);
        // Fallback when CMS is empty: no crash, just show local assets
        setData({
          settings: {
            artistName: 'Nelson Deus',
            socials: [],
          },
          rootFolders: [],
          rootFiles: [],
        });
      }
    })();
  }, []);

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <SpinnerIcon size={32} className='animate-spin' />
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className='flex flex-col h-full w-full'>
      <TopBar setOpenSearch={setOpenSearch} settings={data.settings} />
      <ExplorerClient
        ref={explorerRef}
        settings={data.settings}
        rootFolders={data.rootFolders}
        rootFiles={data.rootFiles}
      />

      {openSearch && (
        <SearchModal
          onClose={() => setOpenSearch(false)}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filteredItems={filteredItems}
          explorerRef={explorerRef}
          setOpenSearch={setOpenSearch}
        />
      )}
    </div>
  );
}
