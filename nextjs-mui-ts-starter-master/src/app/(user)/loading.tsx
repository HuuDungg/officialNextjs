import { CircularProgress } from "@mui/material";

export default function Loading() {

    return (
        <>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh', // Full viewport height for vertical centering
                width: '100%'    // Full width to ensure horizontal centering
            }}>
                <CircularProgress />
            </div>

        </>
    )
}