import { baseRequest } from "@/api/baseRequest";
import { IDeskproClient } from "@deskpro/app-sdk";
import { SmartsheetUser } from "@/types/smartsheet";

export async function getActiveSmartsheetUser(client: IDeskproClient): Promise<SmartsheetUser | null> {

    try {
        return await baseRequest<SmartsheetUser>(client, { url: `/users/me` })
    } catch {
        return null
    }
}