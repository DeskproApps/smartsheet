import { P5 } from "@deskpro/deskpro-ui"
import { useInitialisedDeskproAppClient } from "@deskpro/app-sdk"
import { useState } from "react"
import type { FC } from "react"

type Props = { entityId: string }

const DeskproTickets: FC<Props> = ({ entityId }) => {
  const [ticketCount, setTicketCount] = useState<number>(0)

  useInitialisedDeskproAppClient((client) => {
    client.entityAssociationCountEntities("linkedSmartsheetTasks", entityId)
      .then(setTicketCount)
      .catch(()=>{})
  });

  return <P5>{ticketCount}</P5>
};

export default DeskproTickets
