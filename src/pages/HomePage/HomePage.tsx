import { AppElementPayload, HorizontalDivider, Link, useDeskproAppClient, useDeskproAppEvents, useDeskproElements, useDeskproLatestAppContext, useInitialisedDeskproAppClient } from "@deskpro/app-sdk";
import { Container } from "@/components/Layout/Container";
import { FC, Fragment, useEffect, useState } from "react"
import { getRegisteredTaskIds, useLogout } from "@/api/deskpro";
import { P1, Spinner, Stack } from "@deskpro/deskpro-ui"
import { Task } from "@/types/smartsheet";
import { TicketData } from "@/types";
import { useNavigate } from "react-router-dom"
import { useSetTitle } from "@/hooks/useSetTitle";
import Card from "@/components/Card";
import TaskDetail from "@/components/TaskDetail";
import useTasks from "@/hooks/useTasks";


const HomePage: FC = () => {

  useSetTitle("Smartsheet")
  const navigate = useNavigate()
  const { client } = useDeskproAppClient()
  const { context } = useDeskproLatestAppContext<TicketData, unknown>()
  const [linkedTaskIds, setLinkedTaskIds] = useState<Task["id"][]>([])
  const { isLoading, tasks } = useTasks()
  const { logoutActiveUser } = useLogout()

  useDeskproElements(({ clearElements, registerElement }) => {
    clearElements();
    registerElement("plus", {
      type: "plus_button",
      payload: { type: "changePage", path: "/rows/link" },
    })
    registerElement("refresh", { type: "refresh_button" })
    registerElement("menu", { type: "menu", items: [{ title: "Logout" }] })
  })

  useDeskproAppEvents({
    onElementEvent(_id: string, type: string, _payload?: AppElementPayload) {
      switch (type) {
        case "plus_button":
          navigate("/rows/link")
          break;
        case "menu":
          logoutActiveUser()
          break;
      }
    },
  });

  const ticketId = context?.data?.ticket.id

  // Set the linked tasks once the page loads
  useEffect(() => {
    if (!ticketId || !client) return
    getRegisteredTaskIds(client, ticketId).then(setLinkedTaskIds).catch(() => setLinkedTaskIds([]))
  }, [client, ticketId])

  // Set the app's badge count as the number of linked tasks
  useInitialisedDeskproAppClient((client) => {
    if (!ticketId) {
      return;
    }
    client.getEntityAssociation("linkedSmartsheetTasks", ticketId)
      .list()
      .then((cardIds) => { client.setBadgeCount(cardIds.length) })
      .catch(() => { client.setBadgeCount(0) })
  }, [client])

  const linkedTasks = tasks.filter((task) => linkedTaskIds.includes(task.id))

  if (isLoading) {
    return (
      <Stack padding={20} justify={"center"}>
        <Spinner />
      </Stack>
    )
  }

  return (<Container>
    {!linkedTasks.length ? <Stack><P1>No linked tasks. <Link href="#" onClick={(e) => {
      e.preventDefault()
      navigate("/rows/link")
    }}>Link Tasks</Link></P1>  </Stack> : linkedTasks.map((linkedTask) => {
      return (
        <Fragment key={linkedTask.id}>
          <Card>
            <Card.Body>
              <TaskDetail task={linkedTask} onClickTitle={() => navigate(`/sheet/${linkedTask.sheet.id}/rows/${linkedTask.id}`)} />
            </Card.Body>
          </Card>
          <HorizontalDivider style={{ marginBottom: 6 }} />
        </Fragment>
      )
    })}
  </Container>)

}

export default HomePage