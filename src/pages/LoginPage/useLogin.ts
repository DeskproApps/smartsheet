import { ContextData, Settings } from '@/types/deskpro';
import { createSearchParams, useNavigate } from 'react-router-dom';
import { getActiveSmartsheetUser } from '@/api/smartsheet/getActiveSmartsheetUser';
import { getRegisteredTaskIds } from '@/api/deskpro';
import { OAuth2Result, useDeskproLatestAppContext, useInitialisedDeskproAppClient } from '@deskpro/app-sdk';
import { placeholders } from '@/placeholders';
import { useCallback, useState } from 'react';
import getSmartsheetAccessToken from "@/api/smartsheet/getSmartsheetAccessToken";

interface UseLogin {
    onSignIn: () => void,
    authUrl: string | null,
    error: null | string,
    isLoading: boolean,
};

export default function useLogin(): UseLogin {
    const [authUrl, setAuthUrl] = useState<string | null>(null)
    const [error, setError] = useState<null | string>(null)
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()

    const { context } = useDeskproLatestAppContext<ContextData, Settings>()

    const ticketId = context?.data?.ticket?.id


    // TODO: Update useInitialisedDeskproAppClient typing in the
    // App SDK to to properly handle both async and sync functions

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    useInitialisedDeskproAppClient(async (client) => {
        if (context?.settings.use_deskpro_saas === undefined || !ticketId) {
            // Make sure settings have loaded.
            return
        }

        const mode = context?.settings.use_deskpro_saas ? 'global' : 'local';

        const clientId = context?.settings.client_id;
        if (mode === 'local' && (typeof clientId !== 'string' || clientId.trim() === "")) {
            // Local mode requires a clientId.
            setError("A client ID is required");
            return
        }

        const oauth2 = mode === "local" ?
            await client.startOauth2Local(
                ({ state, callbackUrl }) => {
                    return `https://app.smartsheet.com/b/authorize?${createSearchParams([
                        ["response_type", "code"],
                        ["client_id", clientId ?? ""],
                        ["redirect_uri", callbackUrl],
                        ["scope", "READ_SHEETS WRITE_SHEETS"],
                        ["state", state],
                    ]).toString()}`;
                },
                /\bcode=(?<code>[^&#]+)/,
                async (code: string): Promise<OAuth2Result> => {
                    // Extract the callback URL from the authorization URL
                    const url = new URL(oauth2.authorizationUrl);
                    const redirectUri = url.searchParams.get("redirect_uri");

                    if (!redirectUri) {
                        throw new Error("Failed to get callback URL");
                    }

                    const data: OAuth2Result["data"] = await getSmartsheetAccessToken(client, { code, redirect_uri: redirectUri });

                    return { data }
                }
            )
            // Global Proxy Service
            : await client.startOauth2Global("190b8eca-21a8-4753-aa6e-c32b55078c72");

        setAuthUrl(oauth2.authorizationUrl)
        setIsLoading(false)

        try {
            const result = await oauth2.poll()

            await client.setUserState(placeholders.OAUTH2_ACCESS_TOKEN_PATH, result.data.access_token, { backend: true })

            if (result.data.refresh_token) {
                await client.setUserState(placeholders.OAUTH2_REFRESH_TOKEN_PATH, result.data.refresh_token, { backend: true })
            }

            const activeUser = await getActiveSmartsheetUser(client)

            if (!activeUser) {
                throw new Error("Error authenticating user")
            }

            getRegisteredTaskIds(client, ticketId)
                .then((linkedTaskIds) => {
                    linkedTaskIds.length < 1 ? navigate("/rows/link") :
                        navigate("/home")
                })
                .catch(() => { navigate("/rows/link") })

        } catch (error) {
            setError(error instanceof Error ? error.message : 'Unknown error');
            setIsLoading(false);
        }
    }, [setAuthUrl, context?.settings.use_deskpro_saas])

    const onSignIn = useCallback(() => {
        setIsLoading(true);
        window.open(authUrl ?? "", '_blank');
    }, [setIsLoading, authUrl]);

    return { authUrl, onSignIn, error, isLoading }

}