'use client'
import './theme.css'
import { FileWithPath, useDropzone } from "react-dropzone";
import { Button as BaseButton } from '@mui/base/Button';
import { styled } from '@mui/system';
import Stack from '@mui/material/Stack';
import { CloudUpload } from '@mui/icons-material';
import { useCallback, useState } from 'react';
import { sendRequest, sendRequestFile } from '@/utils/api';
import { useSession } from 'next-auth/react';
import axios from 'axios';
export function UnstyledButtonsSimple() {
    return (
        <Stack spacing={2} direction="row">
            <Button>
                <CloudUpload sx={{
                    position: 'relative',
                    top: 6,
                    right: 4
                }} />
                Upload
            </Button>
        </Stack>
    );
}

const blue = {
    200: '#99CCFF',
    300: '#66B2FF',
    400: '#3399FF',
    500: '#007FFF',
    600: '#0072E5',
    700: '#0066CC',
};

const grey = {
    50: '#F3F6F9',
    100: '#E5EAF2',
    200: '#DAE2ED',
    300: '#C7D0DD',
    400: '#B0B8C4',
    500: '#9DA8B7',
    600: '#6B7A90',
    700: '#434D5B',
    800: '#303740',
    900: '#1C2025',
};

const Button = styled(BaseButton)(
    ({ theme }) => `
  font-family: 'IBM Plex Sans', sans-serif;
  font-weight: 600;
  font-size: 0.875rem;
  line-height: 1.5;
  background-color: ${blue[500]};
  padding: 8px 16px;
  border-radius: 8px;
  color: white;
  transition: all 150ms ease;
  cursor: pointer;
  border: 1px solid ${blue[500]};
  box-shadow: 0 2px 1px ${theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.5)' : 'rgba(45, 45, 60, 0.2)'
        }, inset 0 1.5px 1px ${blue[400]}, inset 0 -2px 1px ${blue[600]};

  &:hover {
    background-color: ${blue[600]};
  }

  &:active {
    background-color: ${blue[700]};
    box-shadow: none;
    transform: scale(0.99);
  }

  &:focus-visible {
    box-shadow: 0 0 0 4px ${theme.palette.mode === 'dark' ? blue[300] : blue[200]};
    outline: none;
  }

  &.base--disabled {
    background-color: ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
    color: ${theme.palette.mode === 'dark' ? grey[200] : grey[700]};
    border: 0;
    cursor: default;
    box-shadow: none;
    transform: scale(1);
  }
`,
);

interface IProps {
    setPercent: Function,
    setValue: Function,
    setFileName: Function,
    setFileUrl: Function
}

const Step1 = (props: IProps) => {
    const { data: session } = useSession();
    const onDrop = useCallback(async (acceptedFiles: FileWithPath[]) => {
        props.setValue(1)
        if (acceptedFiles && acceptedFiles[0]) {
            const audio = acceptedFiles[0]
            const form = new FormData();

            props.setFileUrl(audio.path)
            form.append("fileUpload", audio);
            let config = {
                headers: {
                    'Authorization': 'Bearer ' + session?.access_token,
                    'target_type': 'tracks',
                }

            }

            try {
                const res = await axios.post('http://localhost:8000/api/v1/files/upload',
                    form,
                    {
                        headers: {
                            'Authorization': 'Bearer ' + session?.access_token,
                            'target_type': 'tracks',
                            delay: 2000
                        },
                        onUploadProgress: progressEvent => {
                            let percentCompleted = Math.floor((progressEvent.loaded * 100) / progressEvent.total!);
                            console.log("check persent: ", percentCompleted)
                            props.setPercent(percentCompleted)
                        }
                    }
                )
                console.log("check file: ", res.data.data.fileName)

                props.setFileName(res.data.data.fileName)
            } catch (error) {
                console.log('checl res: ', error)
            }
        }
    }, [session])
    const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({
        onDrop,
        accept: {
            'audio/aac': [
                '.mp3',
                '.wav',
                '.ogg',
                '.aac',
                '.m4a',
                '.flac',
                '.wma'],
        }

    })

    const files = acceptedFiles.map((file: FileWithPath) => (
        <li key={file.path}>
            {file.path} - {file.size} bytes
        </li>
    ));

    return (
        <section className="container">
            <div {...getRootProps({ className: 'dropzone' })}>
                <input {...getInputProps()} />
                <UnstyledButtonsSimple />
                <p>Drag 'n' drop some files here, or click to select files</p>
            </div>
            <aside>
                <h4>Files</h4>
                <ul>{files}</ul>
            </aside>
        </section>
    );
}

export default Step1