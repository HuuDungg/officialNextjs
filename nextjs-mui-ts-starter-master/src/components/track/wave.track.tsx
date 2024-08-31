'use client'
import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";

import { useSearchParams } from 'next/navigation';
import { useWavesurfer } from "@/utils/customHook";
import './style.scss'

const WaveTrack = () => {


    const searchParams = useSearchParams()
    const fileName = searchParams.get('audio');
    const containerRef = useRef<HTMLDivElement>(null);
    const hoverRef = useRef<HTMLDivElement>(null)!;

    const [timeRef, setTimeRef] = useState<string>("0:00");
    const [duarationRef, setDuarationRef] = useState<string>("0:00");

    const [isPlaying, setIsPlaying] = useState<boolean>(false);



    const optionsMemo = useMemo(() => {
        let gradient, progressGradient;
        if (typeof window !== "undefined") {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d')!;
            // Define the waveform gradient
            gradient = ctx.createLinearGradient(0, 0, 0, canvas.height * 1.35);
            gradient.addColorStop(0, '#656666') // Top color
            gradient.addColorStop((canvas.height * 0.7) / canvas.height, '#656666') // Top color
            gradient.addColorStop((canvas.height * 0.7 + 1) / canvas.height, '#ffffff') // White line
            gradient.addColorStop((canvas.height * 0.7 + 2) / canvas.height, '#ffffff') // White line
            gradient.addColorStop((canvas.height * 0.7 + 3) / canvas.height, '#B1B1B1') // Bottom color
            gradient.addColorStop(1, '#B1B1B1') // Bottom color

            // Define the progress gradient
            progressGradient = ctx.createLinearGradient(0, 0, 0, canvas.height * 1.35)
            progressGradient.addColorStop(0, '#EE772F') // Top color
            progressGradient.addColorStop((canvas.height * 0.7) / canvas.height, '#EB4926') // Top color
            progressGradient.addColorStop((canvas.height * 0.7 + 1) / canvas.height, '#ffffff') // White line
            progressGradient.addColorStop((canvas.height * 0.7 + 2) / canvas.height, '#ffffff') // White line
            progressGradient.addColorStop((canvas.height * 0.7 + 3) / canvas.height, '#F6B094') // Bottom color
            progressGradient.addColorStop(1, '#F6B094') // Bottom color
        }
        return {
            barWidth: 3,
            height: 100,
            progressColor: progressGradient,
            waveColor: gradient,
            url: `/api?nameTrack=${fileName}`,
        }
    }, []);


    const wavesurfer = useWavesurfer(containerRef, optionsMemo);

    const onPlayClick = useCallback(() => {
        if (wavesurfer) {
            wavesurfer?.isPlaying() ? wavesurfer.pause() : wavesurfer?.play()
        }
        setIsPlaying(wavesurfer?.isPlaying() ?? false)
    }, [wavesurfer])

    {
        const formatTime = (seconds: any) => {
            const minutes = Math.floor(seconds / 60)
            const secondsRemainder = Math.round(seconds) % 60
            const paddedSeconds = `0${secondsRemainder}`.slice(-2)
            return `${minutes}:${paddedSeconds}`
        }

        const timeEl = timeRef!;
        const durationEl = duarationRef!;

        wavesurfer?.on('decode', (duration) => {
            setDuarationRef(formatTime(duration))
        })
        wavesurfer?.on('timeupdate', (currentTime) => {
            setTimeRef(formatTime(currentTime))
        })
    }
    {
        const hover = hoverRef.current!;
        const waveform = containerRef.current!;
        waveform?.addEventListener('pointermove', (e) => (hover.style.width = `${e.offsetX}px`))
    }

    return (
        <>
            <div ref={containerRef} className="waveFormContainer">
                <div id="time">{timeRef}</div>
                <div id="duration">{duarationRef}</div>
                <div ref={hoverRef} id="hover"></div>
                <div className="overlay"
                    style={{
                        position: "absolute",
                        height: "30px",
                        width: "100%",
                        bottom: "0",
                        background: "#ccc"
                    }}
                ></div>
            </div>
            <button onClick={() => onPlayClick()}>{isPlaying ? "Pause" : "Play"}</button>
        </>
    )
}

export default WaveTrack;