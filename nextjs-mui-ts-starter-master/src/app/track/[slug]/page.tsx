'use client'

import WaveTrack from "@/components/track/wave.track"
import { Box, Container, Grid } from "@mui/material"
import { useSearchParams } from "next/navigation"
const DetailTrackPage = (props: any) => {
    const { params } = props
    const searchParams = useSearchParams()
    const param = searchParams.get('audio')
    return (
        <>
            <Container>
                <WaveTrack />
            </Container>

        </>
    )
}

export default DetailTrackPage