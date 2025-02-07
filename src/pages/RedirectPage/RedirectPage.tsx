import { FC, useEffect, useState } from "react";
import { getActiveSmartsheetUser } from "@/api/smartsheet/getActiveSmartsheetUser";
import { Spinner, Stack } from "@deskpro/deskpro-ui";
import { TicketData } from "@/types";
import { useDeskproAppClient, useDeskproElements, useDeskproLatestAppContext } from "@deskpro/app-sdk";
import { useNavigate } from "react-router-dom";
import getRegisteredTaskIds from "@/api/deskpro";

const StyledSpinner: FC = () => {
  return (
    <Stack padding={20} justify={"center"}>
      <Spinner />
    </Stack>)
}

const RedirectPage: FC = () => {
  const { client } = useDeskproAppClient()
  const { context } = useDeskproLatestAppContext<TicketData, unknown>()
  const navigate = useNavigate()
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [isFetchingAuth, setIsFetchingAuth] = useState<boolean>(true)

  useDeskproElements(({ registerElement, clearElements }) => {
    clearElements()
    registerElement("refresh", { type: "refresh_button" })
  });

  useEffect(() => {
    if (client) {
      getActiveSmartsheetUser(client)
        .then((activeUser) => {
          if (activeUser) {
            setIsAuthenticated(true)
          }
        })
        .catch(() => { })
        .finally(() => {
          setIsFetchingAuth(false)
        })
    }
  }, [client])

  if (!client || !context?.data?.ticket.id || isFetchingAuth) {
    return (<StyledSpinner />)
  }

  if (isAuthenticated) {
    getRegisteredTaskIds(client, context?.data?.ticket.id)
      .then((linkedTaskIds) => {
        linkedTaskIds.length < 1 ? navigate("/rows/link") :
          navigate("/home")
      })
      .catch(() => { navigate("/rows/link") })
  } else {
    navigate("/login")
  }

  return (<StyledSpinner />)
};

export default RedirectPage