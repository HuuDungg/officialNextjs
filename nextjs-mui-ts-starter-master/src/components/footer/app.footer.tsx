'use client'
import { useHasMounted } from '@/utils/customHook';
import { Container } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import { useContext, useEffect, useRef } from 'react';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import { TrackContext, useTrackContext } from '../track/track.wrapper';

const AppFooter = () => {
    const hasMounted = useHasMounted();
    const playRef = useRef(null)
    const { currentTrack, setCurrentTrack } = useTrackContext() as ITrackContext
    if (!hasMounted) return (<></>)//fragment

    const handlePlay = () => {
        setCurrentTrack({
            ...currentTrack,
            isPlaying: true
        })
    }

    const handlePause = () => {
        setCurrentTrack({
            ...currentTrack,
            isPlaying: false
        })
    }

    //@ts-ignore
    if (playRef?.current?.audio?.current) {
        if (currentTrack.isPlaying) {
            //@ts-ignore
            playRef?.current?.audio?.current.play()
        } else {
            //@ts-ignore
            playRef?.current?.audio?.current.pause()
        }
    }




    return (
        <div style={{
            marginTop: 70
        }}>
            <AppBar position="fixed"
                sx={{
                    top: 'auto', bottom: 0,
                    background: "#f2f2f2",
                }}
            >
                <Container sx={{
                    display: "flex",
                    gap: 10,
                    '.rhap_main': {
                        gap: 5
                    }
                }}>
                    <AudioPlayer
                        ref={playRef}
                        onPlay={() => handlePlay()}
                        onPause={() => handlePause()}
                        layout='horizontal-reverse'
                        src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/tracks/${currentTrack?.trackUrl}`}
                        volume={0.5}
                        style={{
                            boxShadow: "unset",
                            background: "#f2f2f2"
                        }}
                    />
                    <div style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "start",
                        justifyContent: "center",
                        minWidth: 100
                    }}>
                        <div style={{ color: "#ccc" }}>{currentTrack?.uploader.name}</div>
                        <div style={{ color: "black" }}>{currentTrack?.title}</div>
                    </div>
                </Container>
            </AppBar>
        </div>
    )
}

export default AppFooter;