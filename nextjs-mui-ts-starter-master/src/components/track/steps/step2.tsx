import LinearProgress, { LinearProgressProps } from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { Alert, Button, Hidden, MenuItem, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useSession } from 'next-auth/react';
import axios from 'axios';


function LinearProgressWithLabel(props: LinearProgressProps & { value: number }) {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ width: '100%', mr: 1 }}>
                <LinearProgress variant="determinate" {...props} />
            </Box>
            <Box sx={{ minWidth: 35 }}>
                <Typography
                    variant="body2"
                    sx={{ color: 'text.secondary' }}
                >{`${Math.round(props.value)}%`}</Typography>
            </Box>
        </Box>
    );
}

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

export function LinearWithValueLabel() {
    const [progress, setProgress] = useState<number>(10);

    useEffect(() => {
        const timer = setInterval(() => {
            setProgress((prevProgress) => (prevProgress >= 100 ? 10 : prevProgress + 10));
        }, 800);
        return () => {
            clearInterval(timer);
        };
    }, []);

    return (
        <Box sx={{ width: '100%' }}>
            <LinearProgressWithLabel value={progress} />
        </Box>
    );
}

interface IProps {
    percent: number,
    fileName: string,
    fileUrl: string
}

interface iNewTrack {
    title: string;
    description: string;
    trackUrl: string;
    imgUrl: string;
    category: string;
}
const Step2 = (props: IProps) => {
    const [imageUrl, setImageUrl] = useState('')
    const [isAlert, setIsAlert] = useState<boolean>(true)

    const category = [
        {
            value: 'CHILL',
            label: 'CHILL',
        },
        {
            value: 'WORKOUT',
            label: 'WORKOUT',
        },
        {
            value: 'PARTY',
            label: 'PARTY',
        }
    ];
    const [info, setInfo] = useState<iNewTrack>({
        title: '',
        description: '',
        trackUrl: '',
        imgUrl: '',
        category: '',
    })

    const { data: session } = useSession();

    const uploadFile = async (file: File) => {
        const img = file
        const form = new FormData();
        form.append("fileUpload", img);
        let config = {
            headers: {
                'Authorization': 'Bearer ' + session?.access_token,
                'target_type': 'images',
            }
        }
        try {
            const res = await axios.post('http://localhost:8000/api/v1/files/upload',
                form,
                config
            )
            setImageUrl(res.data.data.fileName as string)
            setInfo({
                ...info,
                imgUrl: res.data.data.fileName
            })
        } catch (error) {
            console.log('checl res: ', error)
        }
    }

    const handleSave = async () => {
        let config = {
            headers: {
                'Authorization': 'Bearer ' + session?.access_token,
            }
        }

        try {
            const res = await axios.post('http://localhost:8000/api/v1/tracks',
                {
                    title: info.title,
                    description: info.description,
                    trackUrl: props.fileName,
                    imgUrl: info.imgUrl,
                    category: info.category
                },
                config
            )


        } catch (error) {
            console.log('checl res upload final: ', error)
        }
    }

    useEffect(() => {
        setInfo({
            ...info,
            trackUrl: props.fileUrl
        })
    }, [props.fileName])
    return (
        <>
            {/* {isAlert &&
                <Alert variant="outlined" severity="success">
                    This is an outlined success Alert.
                </Alert>
            } */}
            <Typography variant="h5" gutterBottom>
                {props.fileName}
            </Typography>
            <LinearProgressWithLabel value={props.percent} />
            <Grid container spacing={2}>
                <Grid item xs={6} md={4}
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "column",
                        gap: "10px"
                    }}
                >
                    <div style={{ height: 250, width: 250, background: "#ccc" }}>
                        <div>
                            {info.imgUrl &&
                                <img style={{
                                    height: 250,
                                    width: 250,
                                    overflow: 'hidden'
                                }} src={`${process.env.NEXT_PUBLIC_BACKEND_URL_IMAGES}${imageUrl}`} alt="" />
                            }
                        </div>
                    </div>
                    <div >
                        <Button
                            component="label"
                            role={undefined}
                            variant="contained"
                            tabIndex={-1}
                            startIcon={<CloudUploadIcon />}
                        >
                            Upload files
                            <VisuallyHiddenInput
                                type="file"
                                accept="image/*"
                                onChange={(event) => {
                                    const e = event.target as HTMLInputElement;
                                    if (e.files) {
                                        uploadFile(e.files[0])
                                    }
                                }}
                                multiple
                            />
                        </Button>

                    </div>

                </Grid>
                <Grid item xs={6} md={8}>
                    <TextField
                        onChange={(e) => {
                            setInfo({
                                ...info,
                                title: e.target.value
                            })
                        }}
                        value={info.title}
                        label="Title" variant="standard" fullWidth margin="dense" />
                    <TextField
                        value={info.description}
                        onChange={(e) => {
                            setInfo(
                                {
                                    ...info,
                                    description: e.target.value
                                }
                            )
                        }}
                        label="Description" variant="standard" fullWidth margin="dense" />
                    <TextField
                        sx={{
                            mt: 3
                        }}
                        id="outlined-select-currency"
                        select
                        label="Category"
                        fullWidth
                        variant="standard"
                        onChange={(e) => {
                            setInfo(
                                {
                                    ...info,
                                    category: e.target.value
                                }
                            )
                        }}
                    >
                        {category.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextField>
                    <Button
                        variant="outlined"
                        sx={{
                            mt: 5
                        }}
                        onClick={() => {
                            handleSave();
                        }}
                    >Save</Button>
                </Grid>
            </Grid >
        </>
    )
}

export default Step2