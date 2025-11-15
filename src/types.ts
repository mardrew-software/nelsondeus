import { RichTextContent } from "@graphcms/rich-text-types";

export type FileType = 'TEXT' | 'AUDIO' | 'VIDEO' | 'IMAGE';

export interface Asset {
    url: string;
    mimeType?: string;
    width?: number;
    height?: number;
}

export interface FileNode {
    id: string;
    name: string;
    showName: boolean;
    slug: string;
    date: string;
    type: FileType;
    icon?: Asset | null;
    description?: { html: string | null };
    media?: Asset | null;
    folder?: { id: string; name: string } | null;
    autoplay?: boolean;
}

export interface Folder {
    id: string;
    name: string;
    slug: string;
    icon?: Asset | null;
    parent?: { id: string } | null;
    files: FileNode[];
    subfolders: Folder[];
}

export interface SocialLink {
    id: string;
    platform: string;
    url: string;
    icon: Asset | null;
}

export interface Settings {
    artistName: string;
    socials: SocialLink[];
}
