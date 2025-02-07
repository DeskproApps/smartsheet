import {
    CopyToClipboardInput,
    LoadingSpinner,
    useInitialisedDeskproAppClient,
} from "@deskpro/app-sdk";
import { P1 } from "@deskpro/deskpro-ui";
import { useState, useMemo } from "react";
import { v4 as uuid } from 'uuid';
import type { FC } from "react";

const AdminCallbackPage: FC = () => {
    const [callbackUrl, setCallbackUrl] = useState<string | null>(null);
    const key = useMemo(() => uuid(), [])

    useInitialisedDeskproAppClient((client) => {
        client.oauth2()
            .getAdminGenericCallbackUrl(key, /code=(?<token>[0-9a-f]+)/, /state=(?<key>.+)/)
            .then(({ callbackUrl }) => setCallbackUrl(callbackUrl));
    }, [key]);

    if (!callbackUrl) {
        return (<LoadingSpinner />);
    }

    return (
        <>
            <CopyToClipboardInput value={callbackUrl} />
            <P1>The callback URL will be required during your Smartsheet app setup</P1>
        </>
    );
};

export default AdminCallbackPage
