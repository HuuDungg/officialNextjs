import { sendRequest } from "@/utils/api"
import { Container } from "@mui/material"

const TestA = async () => {
    const res = await sendRequest<any>({
        url: `http://localhost:3000/api/test`,
        method: "GET",
        nextOption: {
            next: { tags: ['rd'] }
        }
    })
    return (
        <Container sx={{ mt: 5 }}>
            <div>tets ramdom</div>
            <div>
                {JSON.stringify(res)}
            </div>
        </Container>
    )
}

export default TestA