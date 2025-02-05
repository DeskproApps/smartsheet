import { AppElementPayload, HorizontalDivider, useDeskproAppClient, useDeskproAppEvents, useDeskproElements, useDeskproLatestAppContext } from "@deskpro/app-sdk";
import { FC } from "react";
import { P1, Spinner, Stack } from "@deskpro/deskpro-ui";
import { TicketData } from "@/types";
import { useNavigate, useParams } from "react-router-dom";
import { useSetTitle } from "@/hooks/useSetTitle";
import getRegisteredTaskIds from "@/api/deskpro";
import TaskCells from "./TaskCells";
import useTasks from "../LinkTasksPage/useTasks";

const TaskNotFound: FC = () => {
    return (<Stack padding={12}><P1>Task not found.</P1>  </Stack>)
}

const ViewTaskPage: FC = () => {
    const navigate = useNavigate()
    useSetTitle("Smartsheet")

    const { sheetId, rowId } = useParams()

    if (!sheetId || !rowId) return (<TaskNotFound />)

    // Providing the sheet id will return a task array with one task
    const { tasks, isLoading } = useTasks(Number(sheetId))
    const { client } = useDeskproAppClient()
    const { context } = useDeskproLatestAppContext<TicketData, unknown>()

    const ticketId = context?.data?.ticket.id

    useDeskproElements(({ clearElements, registerElement }) => {
        clearElements();
        registerElement("home", { type: "home_button" })
        registerElement("edit", { type: "edit_button" })
        registerElement("refresh", { type: "refresh_button" })
        registerElement("menu", { type: "menu", items: [{ title: "Unlink task" }] })
    });



    useDeskproAppEvents({
        onElementEvent(_id: string, type: string, _payload?: AppElementPayload) {
            switch (type) {
                case "home_button":
                    navigate("/home")
                    break;
                case "edit_button":
                    navigate(`/sheets/${sheetId}/${rowId}/edit`)
                    break;
                case "menu":
                    if (!client || !ticketId) break
                    getRegisteredTaskIds(client, ticketId)
                        .then(() => {
                            client.getEntityAssociation("linkedSmartsheetTasks", ticketId)
                                .delete(rowId)
                        })
                        .then(() => { navigate("/home") })
                        .catch(() => { })
                    break
            }
        },
    });

    if (isLoading) return (
        <Stack padding={20} justify={"center"}>
            <Spinner />
        </Stack>
    )

    const activeTask = tasks[0]
    if (!activeTask) return (<TaskNotFound />)

    return <>
        <TaskCells task={activeTask} />
        <HorizontalDivider style={{ marginBottom: 6 }} />
    </>
}

export default ViewTaskPage