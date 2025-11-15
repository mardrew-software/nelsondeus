'use client';

import { FileType } from '@/types';

type Props = {
    name: string;
    showName?: boolean;
    type?: FileType | 'FOLDER';
    iconUrl?: string | null;
    mediaUrl?: string | null;
};


const TextIcon = ({ name }: { name: string }) => {
    return (
        <img style={{ width: '120px' }} className='p-1 border border-1 border-transparent hover:border-stone-400 rounded' src={"/text_icon.png"} alt={name} />
    );
};


export default function ExplorerIcon({ showName = true, name, type, iconUrl, mediaUrl }: Props) {

    const renderFallback = () => {
        switch (type) {
            case 'FOLDER':
                return <img style={{ width: '120px' }} className='p-1 border border-1 border-transparent hover:border-stone-400 rounded' src={"/folder_icon.png"} alt={name} />;
            case 'AUDIO':
                return <img style={{ width: '120px' }} className='p-1 border border-1 border-transparent hover:border-stone-400 rounded' src={"/audio_icon.png"} alt={name} />;
            case 'VIDEO':
                return <img style={{ width: '120px' }} className='p-1 border border-1 border-transparent hover:border-stone-400 rounded' src={"/video_icon.png"} alt={name} />;
            case 'IMAGE':
                return mediaUrl ? (
                    <img style={{ width: '120px' }} className='p-1 border border-1 border-transparent hover:border-stone-400 rounded' src={mediaUrl} alt={name} />
                ) : (
                    <TextIcon name={name} />
                );
            case 'TEXT':
                return <TextIcon name={name} />;
            default:
                return <TextIcon name={name} />;
        }
    };

    return (
        <button className="flex flex-col items-center gap-0.5 cursor-pointer" title={name}>
            {iconUrl ? (
                <img style={{ width: '120px' }} className='p-1 border border-1 border-transparent hover:border-stone-400 rounded' src={iconUrl} alt={name} />
            ) : (
                renderFallback()
            )}
            {showName && <div className='max-w-[120px]'>{name}</div>}
        </button>
    );
}