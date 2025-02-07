import { AnchorButton, H3, Stack } from "@deskpro/deskpro-ui";
import { Container } from "@/components/Layout/Container";
import { FC } from "react";
import { useDeskproElements } from "@deskpro/app-sdk";
import { useSetTitle } from "@/hooks/useSetTitle";
import useLogIn from "./useLogin";

const LoginPage: FC = () => {
    useSetTitle("Smartsheet")

    useDeskproElements(({ registerElement, clearElements }) => {
        clearElements()
        registerElement("refresh", { type: "refresh_button" })
    })

    const { authURL, isLoading, poll } = useLogIn();

    return (<Container>
        <Stack vertical gap={12}>
            <H3>Log into your Smartsheet account.</H3>
            <AnchorButton
                disabled={!authURL || isLoading}
                href={authURL || "#"}
                loading={isLoading}
                onClick={poll}
                target={"_blank"}
                text={"Log In"}

            />
        </Stack>
    </Container>)
}

export default LoginPage