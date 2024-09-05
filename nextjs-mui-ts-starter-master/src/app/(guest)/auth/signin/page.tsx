import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import AuthSignIn from "@/components/auth/auth.signin"
import { Grid } from "@mui/material"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"

const SigninPage = async () => {
    const session = await getServerSession(authOptions)
    if (session) {
        redirect('/')
    }
    return (
        <>
            <AuthSignIn></AuthSignIn>
        </>
    )
}

export default SigninPage