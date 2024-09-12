import CartUpload from "@/components/profile/cart.upload"
import { sendRequest } from "@/utils/api"
import { Container, Grid } from "@mui/material"

const PageProfile = async ({ params }: { params: { slug: string } }) => {

    const res = await sendRequest<IBackendRes<ITrackTop[]>>(
        {
            url: 'http://localhost:8000/api/v1/tracks/users?current=1&pageSize=10',
            method: "POST",
            body: {
                id: params.slug
            }
        }
    )
    //@ts-ignore
    const data: ITrackTop[] = res.data.result
    return (
        <>
            <Container>
                <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} style={{ marginTop: 19 }} gap={10}>
                    {
                        data.map((item, id) => (
                            <Grid key={id} item xs={5.5}>
                                <CartUpload item={item} />
                            </Grid>
                        ))
                    }
                </Grid>
            </Container>
        </>
    )
}
export default PageProfile