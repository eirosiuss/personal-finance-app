// itr
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Login from "../../src/components/pages/Login.jsx";
import { expect } from "vitest";

describe("Login Component", () => {
  it("should render login component", () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
    expect(screen.getByRole("heading", { name: /login/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });
});
