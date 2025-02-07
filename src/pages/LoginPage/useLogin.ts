import { getActiveSmartsheetUser } from '@/api/smartsheet/getActiveSmartsheetUser';
import { OAuth2StaticCallbackUrl, useDeskproAppClient, useDeskproLatestAppContext, useInitialisedDeskproAppClient } from '@deskpro/app-sdk';
import { Settings } from '@/types/deskpro';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import getSmartsheetAccessToken from "@/api/smartsheet/getSmartsheetAccessToken";

export default function useLogIn() {
    const { client } = useDeskproAppClient()
    const { context } = useDeskproLatestAppContext<unknown, Settings>()
    const [isLoading, setIsLoading] = useState(false)
    const [callback, setCallback] = useState<OAuth2StaticCallbackUrl | null>(null)
    const [authURL, setAuthURL] = useState<string | null>(null)
    const key = useMemo(() => uuid(), [])
    const navigate = useNavigate()

    const clientId = context?.settings.client_id

    useInitialisedDeskproAppClient(client => {
        client
            .oauth2()
            .getGenericCallbackUrl(key, /code=(?<token>.+?)&/, /state=(?<key>[^&]+)/)
            .then(setCallback).catch(()=>{});
    }, [setCallback]);

    useEffect(() => {
        if (callback?.callbackUrl && clientId) {
            setAuthURL(`https://app.smartsheet.com/b/authorize?${new URLSearchParams({
                response_type: "code",
                client_id: clientId,
                redirect_uri: callback.callbackUrl,
                state: key,
                scope: "READ_SHEETS WRITE_SHEETS"
            }).toString()}`)
        }
    }, [key, callback, clientId])

    const poll = useCallback(() => {
        if (!callback?.poll || !client || !context) {
            return
        }

        setTimeout(() => setIsLoading(true), 500);

        callback.poll()
            // Exchange the token for access and refresh tokens
            .then(({ token }) => {
                return getSmartsheetAccessToken(client, {
                    code: token,
                    redirect_uri: callback.callbackUrl,
                })
            })
            // Save access and refresh tokens in user state
            .then(({ access_token, refresh_token }) => {
                return Promise.all([
                    client.setUserState('oauth2/access_token', access_token, { backend: true }),
                    client.setUserState('oauth2/refresh_token', refresh_token, { backend: true })
                ])
            })
            // Get the user's info and redirect to the "Link Tasks" page if the user is valid/found
            .then(() => {
                return getActiveSmartsheetUser(client)
            })
            .then((activeUser) => {
                if (activeUser) {
                    navigate("/rows/link")
                }
            })
            .catch(() => { })
            // Reset loading state after polling is done
            .finally(() => {
                setIsLoading(false);
            });
    }, [callback, navigate, client, context,]);

    return {
        authURL,
        isLoading,
        poll,
    };
};