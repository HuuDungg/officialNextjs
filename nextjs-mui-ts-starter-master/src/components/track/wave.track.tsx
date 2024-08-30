import { useEffect, useRef } from "react"
import WaveSurfer from 'wavesurfer.js'
const WaveTrack = () => {
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        WaveSurfer.create({
            container: containerRef.current!,
            waveColor: 'rgb(200, 0, 200)',
            progressColor: 'rgb(100, 0, 100)',
            url: '/audio/lynd.mp3',
        })
    }, [])
    return (
        <>
            <div ref={containerRef}>

            </div>
        </>
    )
}

export default WaveTrack