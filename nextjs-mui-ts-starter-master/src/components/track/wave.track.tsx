'use client'
import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";

import { useParams, useSearchParams } from 'next/navigation';
import { useWavesurfer } from "@/utils/customHook";
import './style.scss'
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import { Grid, TextField, Tooltip } from "@mui/material";
import { useTrackContext } from "./track.wrapper";
import { sendRequest } from "@/utils/api";
import { AccountCircle } from "@mui/icons-material";
const WaveTrack = () => {

    const { currentTrack, setCurrentTrack } = useTrackContext() as ITrackContext
    const searchParams = useSearchParams()
    const fileName = searchParams.get('audio');
    const containerRef = useRef<HTMLDivElement>(null);
    const hoverRef = useRef<HTMLDivElement>(null)!;

    const [timeRef, setTimeRef] = useState<string>("0:00");
    const [duarationRef, setDuarationRef] = useState<string>("0:00");

    const [isPlaying, setIsPlaying] = useState<boolean>(false);

    const [arrComments, setArrComments] = useState<IComment[]>(
        []
    )

    const loadDataComment = async () => {
        console.log("check id alfter post: ", currentTrack._id)
        const res = await sendRequest<IBackendRes<IComment[]>>({
            url: `http://localhost:8000/api/v1/tracks/comments`,
            method: "POST",
            queryParams: {
                current: 1,
                pageSize: 10,
                // trackId: currentTrack._id,
                trackId: '66cd5a7aa0a34239beb977c7',
                sort: "-createdAt"
            }
        })
        //@ts-ignore
        setArrComments(res?.data?.result as IComment)
    }

    useEffect(() => {
        loadDataComment();
    }, [])


    const calLeft = (moment: number) => {
        const hardCodeDuration = 199;
        const percent = (moment / hardCodeDuration) * 100;
        return `${percent}%`
    }


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

    useEffect(() => {
        if (currentTrack.isPlaying) {
            wavesurfer?.play()
            setIsPlaying(true)
        } else {
            wavesurfer?.pause()
            setIsPlaying(false)
        }
    }, [currentTrack.isPlaying])
    const onPlayClick = useCallback(() => {
        if (wavesurfer) {
            if (wavesurfer?.isPlaying()) {
                wavesurfer.pause()
                setIsPlaying(true)
                setCurrentTrack({
                    ...currentTrack,
                    isPlaying: false
                })
            } else {
                wavesurfer.play()
                setIsPlaying(true)
                setCurrentTrack({
                    ...currentTrack,
                    isPlaying: true
                })
            }
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

        wavesurfer?.on('click', () => {
            wavesurfer.play()
            setIsPlaying(true)
        })
    }
    {
        const hover = hoverRef.current!;
        const waveform = containerRef.current!;
        waveform?.addEventListener('pointermove', (e) => (hover.style.width = `${e.offsetX}px`))
    }

    return (
        <div style={{ marginTop: 20 }}>
            <div style={{
                display: "flex", gap: 15, padding: 20, height: 400,
                background: "linear-gradient(135deg, rgb(106, 112, 67) 0%, rgb(11, 15, 20) 100%)"
            }}>
                <div className="left" style={{
                    width: "75%", height: "calc(100% - 10px)", display: "flex",
                    flexDirection: "column", justifyContent: "space-between"
                }}>
                    <div className="info" style={{ display: "flex" }}>
                        <div>
                            <div onClick={() => onPlayClick()}
                                style={{
                                    borderRadius: "50%",
                                    background: "#f50",
                                    height: "50px",
                                    width: "50px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    cursor: "pointer"
                                }}
                            >
                                {isPlaying === true ?
                                    <PauseIcon sx={{ fontSize: 30, color: "white" }} />
                                    :
                                    <PlayArrowIcon sx={{ fontSize: 30, color: "white" }} />
                                }
                            </div>
                        </div>
                        <div style={{ marginLeft: 20 }}>
                            <div style={{
                                padding: "0 5px", background: "#333", fontSize: 30, width: "fit-content",
                                color: "white"
                            }}>
                                Hỏi Dân IT's song
                            </div>
                            <div style={{
                                padding: "0 5px", marginTop: 10, background: "#333", fontSize: 20,
                                width: "fit-content", color: "white"
                            }}>
                                Eric
                            </div>
                        </div>
                    </div>
                    <div ref={containerRef} className="waveFormContainer">
                        <div id="time">{timeRef}</div>
                        <div id="duration">{duarationRef}</div>
                        <div ref={hoverRef} id="hover"></div>
                        <div className="overlay" style={{
                            position: "absolute", height: "30px", width: "100%", bottom: "0",
                            backgroundColor: "#ccc",
                        }}>
                            <div className="comments" style={{
                                position: "relative",
                                top: 2,
                                zIndex: 20
                            }}>
                                {arrComments &&
                                    arrComments.map((cmt, id) => {
                                        return (
                                            <Tooltip key={id} title={cmt.content} arrow>
                                                <img
                                                    onPointerMove={(e) => {
                                                        const hover = hoverRef.current!;
                                                        hover.style.width = calLeft(cmt.moment + 3)
                                                    }}
                                                    key={cmt._id} style={{
                                                        width: 20,
                                                        height: 20,
                                                        position: 'absolute',
                                                        left: calLeft(cmt.moment),
                                                    }} src={'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrj8pIhVdurmDWMhrIQWRzeDMWFWwIAMot7Q&s'} alt="img of comments" />
                                            </Tooltip>


                                        )
                                    })
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <div className="right" style={{ width: "25%", padding: 15, display: "flex", alignItems: "center" }}>
                    <div style={{ background: "#ccc", width: 250, height: 250 }}>
                        <img src={process.env.NEXT_PUBLIC_BACKEND_URL_IMAGES + currentTrack.imgUrl} alt="" style={{
                            width: 250, height: 250, overflow: 'hidden'
                        }} />
                    </div>
                </div>
            </div>
            <div style={{
                width: '100%',
                margin: '30px 30px',
                alignItems: 'center',
            }}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField sx={{
                            width: '100%'
                        }} id="standard-basic" label="Add a comment" variant="standard" />
                    </Grid>
                    <Grid item xs={12}>
                        {arrComments &&
                            arrComments.map(track => (
                                <div
                                    key={track._id}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 20,
                                        margin: '20px 20px'
                                    }}
                                >
                                    <AccountCircle />
                                    {track.content}
                                </div>
                            ))
                        }
                    </Grid>
                </Grid>
            </div>
        </div >

    )
}

export default WaveTrack;