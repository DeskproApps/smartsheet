import { faSearch, faTimes, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Input, IconButton } from "@deskpro/deskpro-ui";
import { useState, useEffect, useCallback } from "react";
import Label from "../Label";
import type { FC, ChangeEvent } from "react";

type SearchInputProps = {
  label?: string,
  onChange?: (search: string) => void,
  disabled?: boolean,
  required?: boolean,
  isFetching?: boolean,
};

const SearchInput: FC<SearchInputProps> = ({
  label,
  onChange,
  disabled = false,
  required = false,
  isFetching = false,
}) => {
  const [search, setSearch] = useState<string>("")

  const onChangeSearch = useCallback(({ target: { value: q } }: ChangeEvent<HTMLInputElement>) => {
    setSearch(q)
  }, [])

  const onClearSearch = useCallback(() => {
    setSearch("")
  }, [])

  useEffect(() => {
    onChange && onChange(search)
  }, [search, onChange])

  return (
    <Label
      required={required}
      label={label}
      htmlFor="search"
    >
      <Input
        id="search"
        name="search"
        value={search}
        disabled={disabled}
        onChange={onChangeSearch}
        leftIcon={isFetching
          ? <FontAwesomeIcon icon={faSpinner} spin />
          : faSearch
        }
        rightIcon={(
          <IconButton icon={faTimes} minimal onClick={onClearSearch} />
        )}
      />
    </Label>
  );
}

export default SearchInput;
