import { applyTaskFilter } from "@/api/smartsheet";
import { Maybe } from "@/types/general";
import { Sheet, Task } from "@/types/smartsheet";
import { TicketData } from "@/types";
import {
  useDeskproElements,
  useDeskproAppClient,
  useDeskproLatestAppContext,
  useInitialisedDeskproAppClient,
} from "@deskpro/app-sdk";
import { useEffect, useState, type FC } from "react";
import { useNavigate } from "react-router-dom";
import { useSetTitle } from "@/hooks/useSetTitle";
import getRegisteredTaskIds from "@/api/deskpro";
import LinkTasks from "./LinkTasks";
import useTasks from "./useTasks";


const LinkTasksPage: FC = ()=>{
  const navigate = useNavigate();
  const { client } = useDeskproAppClient()
  const { context } = useDeskproLatestAppContext<TicketData, unknown>()
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [selectedSheetId, setSelectedSheetId] = useState<Maybe<Sheet["id"]>>(null)
  const [selectedTaskIds, setSelectedTaskIds] = useState<Task["id"][]>([]);
  const {sheets, tasks, isLoading} = useTasks(selectedSheetId)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  
  
  useSetTitle("Link Tasks");
  
  useEffect(() => {
    setSelectedSheetId(null);
  }, [sheets]);
  const ticketId = context?.data?.ticket.id

  // Set the selected tasks once the page loads
  useEffect(() => {
    if (!ticketId || !client) {
      return;
    }
    getRegisteredTaskIds(client, ticketId).then(setSelectedTaskIds)
  }, [client, ticketId])

  // Set the app's badge count as the nuumber of linked tasks
  useInitialisedDeskproAppClient((client) => {
    if (!ticketId) {
      return;
    }
    client.getEntityAssociation("linkedSmartsheetTasks", ticketId).list().then((cardIds) => {client.setBadgeCount(cardIds.length)})
}, [client]);

  useDeskproElements(({ clearElements, registerElement }) => {
    clearElements();
    registerElement("home", {
      type: "home_button",
      payload: { type: "changePage", path: "/home" },
    })
    registerElement("refresh", { type: "refresh_button" })
  });


  const onTaskSelectionChange = (task: Task)=>{
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

  const onLinkTasks = ()=>{
    if(!client || !ticketId || !selectedTaskIds.length) return

    // Attempt linking the tasks and navigate to the home page
    // if successful
    Promise.all(
      [
        ...selectedTaskIds.map((taskId)=> client
        .getEntityAssociation("linkedSmartsheetTasks", ticketId)
      .set(taskId.toString(), {taskId: taskId}))
      ]
    ).then(()=>{
      setIsSubmitting(false)
      navigate("/home")
    }).catch(()=>{throw new Error("Error linking tasks")})

  }



    return (<LinkTasks 
    onCreateTaskClick={() => navigate("/create-task")}
    selectedTaskIds={selectedTaskIds}
    selectedSheetId={selectedSheetId}
    sheets={sheets}
    onChangeProject={setSelectedSheetId}
    onLinkTasks={onLinkTasks}
    onTaskSelectionChange={onTaskSelectionChange}
    tasks={applyTaskFilter(tasks, {query: searchQuery})}
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