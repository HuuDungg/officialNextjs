'use client'

import { useSearchParams } from "next/navigation"

const DetailTrackPage = (props: any) => {
    const { params } = props
    const searchParams = useSearchParams()
    const param = searchParams.get('audio')
    return (
        <>
            this is {param} page
        </>
    )
}

export default DetailTrackPage