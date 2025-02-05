import { Button, H0, Stack } from "@deskpro/deskpro-ui"
import { Container } from "@/components/Layout/Container"
import { FC } from "react"
import { useDeskproElements } from "@deskpro/app-sdk"
import { useNavigate } from "react-router-dom"
import { useSetTitle } from "@/hooks/useSetTitle"


const NotFoundPage: FC = () => {
    const navigate = useNavigate()

    useDeskproElements(({ clearElements }) => {
        clearElements()
    })

    useSetTitle("Smartsheet")
    return <Container>
        <Stack vertical gap={10} padding={10} justify={"center"} align={"center"}>
            <H0>Page Not Found</H0>

            <Button text={"Go To Home"} intent={"secondary"} onClick={() => { navigate("/home") }} />
        </Stack>
    </Container>
}

export default NotFoundPage