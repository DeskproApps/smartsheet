import {
  AppElementPayload,
  useDeskproAppClient,
  useDeskproAppEvents,
  useDeskproElements,
  useDeskproLatestAppContext,
  useInitialisedDeskproAppClient,
} from "@deskpro/app-sdk";
import { applyTaskFilter } from "@/api/smartsheet";
import { getRegisteredTaskIds, useLogout } from "@/api/deskpro";
import { Sheet, Task } from "@/types/smartsheet";
import { TicketData } from "@/types";
import { useEffect, useState, type FC } from "react";
import { useNavigate } from "react-router-dom";
import { useSetTitle } from "@/hooks/useSetTitle";
import LinkTasks from "./LinkTasks";
import useTasks from "@/hooks/useTasks";

const LinkTasksPage: FC = () => {
  const navigate = useNavigate();
  const { client } = useDeskproAppClient()
  const { context } = useDeskproLatestAppContext<TicketData, unknown>()
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [selectedSheetId, setSelectedSheetId] = useState<Sheet["id"] | undefined>(undefined)
  const [selectedTaskIds, setSelectedTaskIds] = useState<Task["id"][]>([]);
  const { sheets, tasks, isLoading } = useTasks(selectedSheetId)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)


  useSetTitle("Link Tasks");

  useEffect(() => {
    setSelectedSheetId(undefined);
  }, [sheets]);
  const ticketId = context?.data?.ticket.id

  useInitialisedDeskproAppClient((client) => {
    if (!ticketId) {
      return;
    }

    // Set the selected tasks once the page loads
    getRegisteredTaskIds(client, ticketId)
      .then(setSelectedTaskIds)
      .catch(() => { setSelectedTaskIds([]) })

    // Set the app's badge count as the number of linked tasks
    client.getEntityAssociation("linkedSmartsheetTasks", ticketId)
      .list()
      .then((cardIds) => { client.setBadgeCount(cardIds.length) })
      .catch(() => { client.setBadgeCount(0) })
  }, [ticketId])

  const { logoutActiveUser } = useLogout()

  useDeskproElements(({ clearElements, registerElement }) => {
    clearElements();
    registerElement("home", {
      type: "home_button",
      payload: { type: "changePage", path: "/home" },
    })
    registerElement("refresh", { type: "refresh_button" })
    registerElement("menu", { type: "menu", items: [{ title: "Logout" }] })

  });

  useDeskproAppEvents({
    onElementEvent(_id: string, type: string, _payload?: AppElementPayload) {
      switch (type) {
        case "home_button":
          navigate("/home")
          break;
        case "menu":
          logoutActiveUser()
          break
      }
    },
  });


  const onTaskSelectionChange = (task: Task) => {
    let newTaskIdsSelection = structuredClone(selectedTaskIds)

    // Check if the task is already selected
    if (selectedTaskIds.some((taskId) => task.id === taskId)) {
      // If the task is already selected, remove it from the selection
      newTaskIdsSelection = selectedTaskIds.filter((taskId) => taskId !== task.id)
    } else {
      // If the task is not selected, add it to the selection
      newTaskIdsSelection.push(task.id)
    }

    setSelectedTaskIds(newTaskIdsSelection)
  }

  const onLinkTasks = () => {
    if (!client || !ticketId || !selectedTaskIds.length) {
      return
    }

    // Attempt linking the tasks and navigate to the home page
    // if successful
    Promise.all(
      [
        ...selectedTaskIds.map((taskId) => client
          .getEntityAssociation("linkedSmartsheetTasks", ticketId)
          .set(taskId.toString(), { taskId: taskId }))
      ]
    ).then(() => {
      setIsSubmitting(false)
      navigate("/home")
    }).catch(() => { throw new Error("Error linking tasks") })

  }

  return (<LinkTasks
    onCreateTaskClick={() => navigate("/create-task")}
    selectedTaskIds={selectedTaskIds}
    selectedSheetId={selectedSheetId}
    sheets={sheets}
    onChangeProject={setSelectedSheetId}
    onLinkTasks={onLinkTasks}
    onTaskSelectionChange={onTaskSelectionChange}
    tasks={applyTaskFilter(tasks, { query: searchQuery })}
    isLoading={isLoading}
    isSubmitting={isSubmitting}
    onChangeSearch={(search: string) => {
      setSearchQuery(search)
    }
    }
  />
  )
}

export default LinkTasksPage