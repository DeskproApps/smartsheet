import { cleanup } from "@testing-library/react";
import { render } from "@deskpro/app-testing-utils";
import SearchInput from "./SearchInput";
import userEvent from "@testing-library/user-event";

describe("Search Input", () => {
  test("render", () => {
    const { container } = render(<SearchInput />, { wrappers: { theme: true } });

    const input = container.querySelector("input#search");
    expect(input).toBeInTheDocument();
  });

  test("should called onChange", async () => {
    const onChange = jest.fn();
    const { container } = render(<SearchInput onChange={onChange}/>, { wrappers: { theme: true } });

    const input = container.querySelector("input#search");
    expect(input).toBeInTheDocument();
    await userEvent.type(input as Element, "search entity");
    expect(onChange).toHaveBeenCalled();
  });

  afterEach(() => {
    jest.clearAllMocks();
    cleanup();
  });
});
