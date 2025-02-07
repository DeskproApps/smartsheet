import { IDeskproClient, proxyFetch } from "@deskpro/app-sdk";

interface AccessTokenRequestPayload {
    code: string
    redirect_uri: string
}
export default async function getSmartsheetAccessToken(client: IDeskproClient, params: AccessTokenRequestPayload) {
    const fetch = await proxyFetch(client)

    const requestPayload = {
        grant_type: "authorization_code",
        client_secret: "__client_secret.urlencode__",
        client_id: "__client_id__",
        ...params
    }

    const response = await fetch("https://api.smartsheet.com/2.0/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams(requestPayload).toString()
    });

    if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
    }

    return response.json();



}