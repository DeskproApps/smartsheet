import { IDeskproClient } from "@deskpro/app-sdk";

export async function getRegisteredTaskIds(client?: IDeskproClient, ticketId?: string): Promise<number[]> {
    if (!ticketId || !client) {
        return []
    }

    const linkedIds = await client.getEntityAssociation("linkedSmartsheetTasks", ticketId).list();
    const taskIds = linkedIds.map(Number);
    return taskIds;
}