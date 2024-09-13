import MainSlider from "@/components/main/main.slider";
import { sendRequest } from "@/utils/api";
import { Container } from "@mui/material";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
// import { sendRequestJS } from "@/utils/old.api"

export default async function HomePage() {


  const session = await getServerSession(authOptions)
  const chill = await sendRequest<IBackendRes<ITrackTop[]>>({
    url: "http://localhost:8000/api/v1/tracks/top",
    method: "POST",
    body: {
      category: "CHILL",
      limit: 10
    }
  })

  const party = await sendRequest<IBackendRes<ITrackTop[]>>({
    url: "http://localhost:8000/api/v1/tracks/top",
    method: "POST",
    body: {
      category: "PARTY",
      limit: 10
    }
  })

  const workout = await sendRequest<IBackendRes<ITrackTop[]>>({
    url: "http://localhost:8000/api/v1/tracks/top",
    method: "POST",
    body: {
      category: "WORKOUT",
      limit: 10
    }
  })


  return (
    <>
      <Container>
        <MainSlider data={chill?.data ?? []} title={"CHILL"} />
        <MainSlider data={party?.data ?? []} title={"PARTY"} />
        <MainSlider data={workout?.data ?? []} title={"WORKOUT"} />
      </Container>

    </>
  );
}
