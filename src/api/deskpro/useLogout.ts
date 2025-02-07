import { useCallback } from "react";
import { useDeskproAppClient } from "@deskpro/app-sdk";
import { useNavigate } from "react-router-dom";

export function useLogout() {
    const navigate = useNavigate();
    const { client } = useDeskproAppClient();

    const logoutActiveUser = useCallback(() => {
        if (!client) {
            return;
        }

        client.deleteUserState("oauth2/access_token")
            .catch(() => { })
            .finally(() => {
                navigate("/login");
            });
    }, [client, navigate]);

    return { logoutActiveUser };
}