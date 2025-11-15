'use client';

import { useEffect, useRef } from 'react';

export default function AutoPlayAudio({ src }: { src: string }) {
    const ref = useRef<HTMLAudioElement | null>(null);
    useEffect(() => {
        const el = ref.current;
        el?.play?.();
        return () => { el?.pause?.(); el && (el.currentTime = 0); };
    }, []);
    return <audio ref={ref} src={src} controls className="media" />;
}