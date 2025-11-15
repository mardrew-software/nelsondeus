'use client';

import { useEffect, useRef } from 'react';

export default function AutoPlayVideo({ src }: { src: string }) {
    const ref = useRef<HTMLVideoElement | null>(null);
    useEffect(() => {
        const el = ref.current;
        el?.play?.();
        return () => { el?.pause?.(); el && (el.currentTime = 0); };
    }, []);
    return <video ref={ref} src={src} controls playsInline className="media" />;
}