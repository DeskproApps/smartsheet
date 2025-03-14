import { ContextData, Settings } from '@/types/deskpro';
import { createSearchParams, useNavigate } from 'react-router-dom';
import { getActiveSmartsheetUser } from '@/api/smartsheet/getActiveSmartsheetUser';
import { getRegisteredTaskIds } from '@/api/deskpro';
import { IOAuth2, OAuth2Result, useDeskproLatestAppContext, useInitialisedDeskproAppClient } from '@deskpro/app-sdk';
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
    const [isPolling, setIsPolling] = useState(false)
    const [oauth2Context, setOAuth2Context] = useState<IOAuth2 | null>(null)
    
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
        // Start OAuth process depending on the authentication mode
        const oauth2Response = mode === "local" ?
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
                    const url = new URL(oauth2Response.authorizationUrl);
                    const redirectUri = url.searchParams.get("redirect_uri");

                    if (!redirectUri) {
                        throw new Error("Failed to get callback URL");
                    }

                    const data: OAuth2Result["data"] = await getSmartsheetAccessToken(client, { code, redirect_uri: redirectUri });

                    return { data }
                }
            )
            // Global Proxy Service
            : await client.startOauth2Global("wa9mhjzul7ctccil8d6");

        setAuthUrl(oauth2Response.authorizationUrl)
        setOAuth2Context(oauth2Response)

        
    }, [setAuthUrl, context?.settings.use_deskpro_saas])


    useInitialisedDeskproAppClient((client) => {
        if (!ticketId || !oauth2Context) {
            return
        }

        const startPolling = async () => {
            try {
                const result = await oauth2Context.poll()
    
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
            } finally {
                setIsLoading(false)
                setIsPolling(false)
            }
        }

        if (isPolling) {
            void startPolling()
        }
    }, [isPolling, ticketId, oauth2Context, navigate])

    const onSignIn = useCallback(() => {
        setIsLoading(true);
        window.open(authUrl ?? "", '_blank');
    }, [setIsLoading, authUrl]);

    return { authUrl, onSignIn, error, isLoading }

}