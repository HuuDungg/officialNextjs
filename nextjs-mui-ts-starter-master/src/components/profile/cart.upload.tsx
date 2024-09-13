'use client'
import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import { useTrackContext } from '../track/track.wrapper';
import PauseIcon from '@mui/icons-material/Pause';
import Link from 'next/link';
interface IProps {
    item: ITrackTop
}

export default function CartUpload(props: IProps) {
    const theme = useTheme();
    const { item } = props;
    const { currentTrack, setCurrentTrack } = useTrackContext() as ITrackContext
    const [isTrue, setIsTrue] = React.useState<boolean>(false)

    React.useEffect(() => {
        if (item._id === currentTrack._id && currentTrack.isPlaying) {
            setIsTrue(true)
        } else {
            setIsTrue(false)
        }
    }, [currentTrack])

    const handlePlay = () => {
        setCurrentTrack(
            {
                "_id": item._id,
                "title": item.title,
                "description": item.description,
                "category": item.category,
                "imgUrl": item.imgUrl,
                "trackUrl": item.trackUrl,
                "countLike": item.countLike,
                "countPlay": item.countPlay,
                "uploader": item.uploader,
                "isDeleted": false,
                "createdAt": item.createdAt,
                "updatedAt": item.updatedAt,
                "isPlaying": true
            }
        )

    }

    const handlePause = () => {
        setIsTrue(false)
        setCurrentTrack({
            ...currentTrack,
            isPlaying: false
        })
    }

    return (
        <Card sx={{ display: 'flex', position: 'relative' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flex: '1 0 auto' }}>
                    <Typography
                        component="div" variant="h5">
                        <Link
                            style={{
                                textDecoration: "unset",
                                color: "unset"
                            }}
                            href={`/track/${item._id}?audio=${item.trackUrl}`}
                            onClick={() => {
                                setCurrentTrack(
                                    {
                                        "_id": item._id,
                                        "title": item.title,
                                        "description": item.description,
                                        "category": item.category,
                                        "imgUrl": item.imgUrl,
                                        "trackUrl": item.trackUrl,
                                        "countLike": 0,
                                        "countPlay": 0,
                                        "uploader": item.uploader,
                                        "isDeleted": false,
                                        "createdAt": item.createdAt,
                                        "updatedAt": item.updatedAt,
                                        "isPlaying": true
                                    }
                                )
                            }}
                        >
                            {item.title}
                        </Link>
                    </Typography>
                    <Typography
                        variant="subtitle1"
                        component="div"
                        sx={{ color: 'text.secondary' }}
                    >
                        {item.uploader.name}
                    </Typography>
                </CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', pl: 1, pb: 1 }}>
                    <IconButton aria-label="previous">
                        {theme.direction === 'rtl' ? <SkipNextIcon /> : <SkipPreviousIcon />}
                    </IconButton>
                    {
                        !isTrue ?
                            <IconButton
                                onClick={() => {
                                    handlePlay()
                                }}
                                aria-label="play/pause">
                                <PlayArrowIcon
                                    sx={{ height: 38, width: 38 }}
                                />
                            </IconButton>
                            :
                            <IconButton
                                onClick={() => {
                                    handlePause()
                                }}
                                aria-label="play/pause">
                                <PauseIcon
                                    sx={{ height: 38, width: 38 }}

                                />
                            </IconButton>
                    }
                    <IconButton aria-label="next">
                        {theme.direction === 'rtl' ? <SkipPreviousIcon /> : <SkipNextIcon />}
                    </IconButton>
                </Box>
            </Box>
            <CardMedia
                component="img"
                sx={{ width: 151, height: 151, overflow: 'hidden', position: 'absolute', right: 0, top: 3 }}
                image={process.env.NEXT_PUBLIC_BACKEND_URL_IMAGES + item.imgUrl}
                alt="Live from space album cover"
            />
        </Card >
    );
}
