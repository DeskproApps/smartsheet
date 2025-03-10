import { AnchorButton, H3, Stack } from "@deskpro/deskpro-ui";
import { Container } from "@/components/Layout/Container";
import { FC } from "react";
import { useDeskproElements, useInitialisedDeskproAppClient } from "@deskpro/app-sdk";
import { useSetTitle } from "@/hooks/useSetTitle";
import StyledErrorBlock from "@/components/StyledErrorBlock";
import useLogIn from "./useLogin";

const LoginPage: FC = () => {
    useSetTitle("Smartsheet")

    useDeskproElements(({ registerElement, clearElements }) => {
        clearElements()
        registerElement("refresh", { type: "refresh_button" })
    })

    // Reset the badge count
    useInitialisedDeskproAppClient((client) => {
        client.setBadgeCount(0)
    }, [])

    const { authUrl, isLoading, onSignIn, error } = useLogIn();

    return (<Container>
        <Stack vertical gap={12}>
            <H3>Log into your Smartsheet account.</H3>
            <AnchorButton
                disabled={!authUrl || isLoading}
                href={authUrl || "#"}
                loading={isLoading}
                onClick={onSignIn}
                target={"_blank"}
                text={"Log In"}
            />
        {error && <StyledErrorBlock>{error}</StyledErrorBlock>}
        </Stack>

    </Container>)
}

export default LoginPage