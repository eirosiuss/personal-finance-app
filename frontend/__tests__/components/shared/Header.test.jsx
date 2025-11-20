import { render, screen } from "@testing-library/react";
import Header from "../../../src/components/shared/Header";

describe("Header component", () => {
  it("should render same text passed into title prop", async () => {
    render(<Header title="header" />);
    const headingElement = screen.getByRole("heading", { name: /header/i });
    expect(headingElement).toBeInTheDocument();
  });
});
