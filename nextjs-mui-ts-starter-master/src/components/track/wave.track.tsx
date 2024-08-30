'use client'

import React, { useEffect, useRef, useState, useMemo } from "react";
import WaveSurfer, { WaveSurferOptions } from "wavesurfer.js";
import { useSearchParams } from 'next/navigation';

// WaveSurfer hook
const useWavesurfer = (containerRef: React.RefObject<HTMLDivElement>, options: Omit<WaveSurferOptions, "container">) => {
    const [wavesurfer, setWavesurfer] = useState<any>(null)

    // or any of the props change
    useEffect(() => {
        if (!containerRef.current) return

        const ws = WaveSurfer.create({
            ...options,
            container: containerRef.current,
        })

        setWavesurfer(ws)

        return () => {
            ws.destroy()
        }
    }, [options, containerRef])

    return wavesurfer
}


const WaveTrack = () => {
    const searchParams = useSearchParams()
    const fileName = searchParams.get('audio');
    const containerRef = useRef<HTMLDivElement>(null);

    const optionsMemo = useMemo(() => {
        return {
            waveColor: 'rgb(200, 0, 200)',
            progressColor: 'rgb(100, 0, 100)',
            url: `/api?nameTrack=${fileName}`,
        }
    }, []);

    const options = {
        waveColor: 'rgb(200, 0, 200)',
        progressColor: 'rgb(100, 0, 100)',
        url: `/api?nameTrack=${fileName}`,
    }

    const wavesurfer = useWavesurfer(containerRef, optionsMemo);

    return (
        <div ref={containerRef}>
            wave track
        </div>
    )
}

export default WaveTrack;