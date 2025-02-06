import { faSearch, faPlus } from "@fortawesome/free-solid-svg-icons";
import { TwoButtonGroup, TwoButtonGroupProps } from "@deskpro/app-sdk";
import { FC } from "react";

type Props = {
  selected: TwoButtonGroupProps["selected"],
  onOneNavigate?: TwoButtonGroupProps["oneOnClick"],
  onTwoNavigate?: TwoButtonGroupProps["twoOnClick"],
}

const TwoColumnNavigation: FC<Props> = ({ selected, onOneNavigate, onTwoNavigate }) => {

  const discardFunc = () => { }

  return (
    <TwoButtonGroup
      selected={selected}
      oneLabel="Find Task"
      twoLabel="Create Task"
      oneIcon={faSearch}
      twoIcon={faPlus}
      oneOnClick={onOneNavigate || discardFunc}
      twoOnClick={onTwoNavigate || discardFunc}
    />
  )
}

export default TwoColumnNavigation 
