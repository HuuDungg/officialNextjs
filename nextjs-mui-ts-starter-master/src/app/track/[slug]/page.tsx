const DetailTrackPage = (props: any) => {
    console.log("check props:", props)
    const { params } = props
    return (
        <>
            this is {params.slug} page
        </>
    )
}

export default DetailTrackPage