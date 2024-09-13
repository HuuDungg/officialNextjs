'use client'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { Settings } from "react-slick";
import { Box } from "@mui/material";
import Button from "@mui/material/Button/Button";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Divider from '@mui/material/Divider';
import Link from "next/link";
import { useTrackContext } from "../track/track.wrapper";

interface IProps {
    data: ITrackTop[],
    title: string
}

const MainSlider = (props: IProps) => {

    const { currentTrack, setCurrentTrack } = useTrackContext() as ITrackContext

    const NextArrow = (props: any) => {
        return (
            <Button variant="outlined" color="inherit"
                onClick={props.onClick}
                sx={{
                    position: "absolute",
                    right: 0,
                    top: "20%",
                    zIndex: 2,
                    minWidth: 30,
                    width: 35,
                    backgroundColor: '#fff',
                    color: "black",
                }}
            >
                <ChevronRightIcon />
            </Button>
        )
    }

    const PrevArrow = (props: any) => {
        return (
            <Button variant="outlined" color="inherit" onClick={props.onClick}
                sx={{
                    position: "absolute",
                    top: "20%",
                    zIndex: 2,
                    minWidth: 30,
                    width: 35,
                    backgroundColor: '#fff',
                    color: "black"
                }}
            >
                <ChevronLeftIcon />
            </Button>
        )
    }

    const { data, title } = props
    const settings: Settings = {
        infinite: true,
        speed: 500,
        slidesToShow: 5,
        slidesToScroll: 1,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
        centerMode: true,
    };
    //box === div

    const handlePlayTrack = (item: ITrackTop) => {
        console.log("check track: ", item)
        setCurrentTrack({
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
        })

        console.log("check curretn track: ", currentTrack)
    }
    return (



        <Box
            sx={{
                margin: "0 50px",
                ".track": {
                    padding: "0 10px",

                    "img": {
                        height: 150,
                        width: 150
                    }
                },
                "h3": {
                    border: "1px solid #ccc",
                    padding: "20px",
                    height: "200px",

                }
            }}
        >
            <h2> {title} </h2>
            <Slider {...settings}>
                {data.map(track => {
                    return (
                        <div className="track" key={track._id}>
                            <img src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/${track.imgUrl}`} />
                            <Link onClick={() => {
                                handlePlayTrack(track);
                            }} style={{ textDecoration: 'unset', color: 'unset' }} href={`/track/${track._id}?audio=${track.trackUrl}`}><h4>{track.title}</h4></Link>
                            <h5>{track.description}</h5>
                        </div>
                    )
                })}
            </Slider>
            <Divider />
        </Box >
    );
}

export default MainSlider;