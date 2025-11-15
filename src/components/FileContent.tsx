'use client';
import { FileNode } from '@/types';
import AutoPlayAudio from './AutoPlayAudio';
import AutoPlayVideo from './AutoPlayVideo';
import RichTextParser from './RichTextParser';

export default function FileContent({ file }: { file: FileNode }) {
    const mediaUrl = file.media?.url;
    if (file.type === 'TEXT' && file.description?.html) {
        return <RichTextParser
            html={file.description?.html}
        />
    }
    if (file.type === 'AUDIO') {
        if (mediaUrl) {
            return <AutoPlayAudio src={mediaUrl} />;
        } else if (file.description?.html) {
            return <RichTextParser
                autoplay={file.autoplay}
                html={file.description?.html}
            />
        }
    }
    if (file.type === 'VIDEO') {
        if (mediaUrl) {
            return <AutoPlayVideo src={mediaUrl} />;
        } else if (file.description?.html) {
            return <RichTextParser
                autoplay={file.autoplay}
                html={file.description?.html}
            />
        }
    }
    if ((file.type === 'IMAGE') && mediaUrl) {
        return (
            <div className='flex flex-col h-full overflow-y-auto'>
                <img style={{ maxHeight: file.media?.height, maxWidth: file.media?.width }} src={mediaUrl} alt={file.name} />
            </div>
        );
    }
    return <></>;
}