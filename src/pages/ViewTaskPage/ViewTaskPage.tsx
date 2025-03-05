import { AppElementPayload, HorizontalDivider, useDeskproAppClient, useDeskproAppEvents, useDeskproElements, useDeskproLatestAppContext } from "@deskpro/app-sdk";
import { FC } from "react";
import { P1, Spinner, Stack } from "@deskpro/deskpro-ui";
import { TicketData } from "@/types";
import { useNavigate, useParams } from "react-router-dom";
import { useSetTitle } from "@/hooks/useSetTitle";
import { getRegisteredTaskIds } from "@/api/deskpro";
import TaskCells from "./TaskCells";
import useTasks from "@/hooks/useTasks";

const TaskNotFound: FC = () => {
    return (<Stack padding={12}><P1>Task not found.</P1>  </Stack>)
}

const ViewTaskPage: FC = () => {
    const navigate = useNavigate()
    useSetTitle("Smartsheet")

    const { sheetId, rowId } = useParams()

    // Providing the sheet id will return an array of tasks from the provided sheet
    const { tasks, isLoading } = useTasks(Number(sheetId))
    const { client } = useDeskproAppClient()
    const { context } = useDeskproLatestAppContext<TicketData, unknown>()

    const ticketId = context?.data?.ticket.id

    useDeskproElements(({ clearElements, registerElement }) => {
        clearElements();
        registerElement("home", { type: "home_button" })
        // Uncomment for future version
        // registerElement("edit", { type: "edit_button" })
        registerElement("refresh", { type: "refresh_button" })
        registerElement("menu", { type: "menu", items: [{ title: "Unlink task" }] })
    });

    useDeskproAppEvents({
        onElementEvent(_id: string, type: string, _payload?: AppElementPayload) {
            switch (type) {
                case "home_button":
                    navigate("/home")
                    break;
                // Uncomment for future version
                // case "edit_button":
                //     navigate(`/sheets/${sheetId}/rows/${rowId}/edit`)
                //     break;
                case "menu":
                    if (!client || !ticketId) break
                    getRegisteredTaskIds(client, ticketId)
                        .then(async () => {
                            try {
                                await client.getEntityAssociation("linkedSmartsheetTasks", ticketId)
                                    .delete(rowId ?? "");
                                navigate("/home");
                            } catch (error) {
                                return
                            }
                        })
                        .catch(() => {

                        });
                    break
            }
        },
    })

    if (isLoading) {
        return (
            <Stack padding={20} justify={"center"}>
                <Spinner />
            </Stack>
        )
    }

    const activeTask = tasks.filter((task) => task.id.toString() === rowId)[0]
    if (!activeTask) {
        return (<TaskNotFound />)
    }

    return (<>
        <TaskCells task={activeTask} />
        <HorizontalDivider style={{ marginBottom: 6 }} />
    </>)
}

export default ViewTaskPage