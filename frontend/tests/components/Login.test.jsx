// itr
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import Login from "../../src/components/pages/Login.jsx";
import SignUp from "../../src/components/pages/SignUp.jsx";

const renderLogin = () =>
  render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  );

describe("Login Component", () => {
  it("should render login component", () => {
    renderLogin();
    expect(screen.getByRole("heading", { name: /login/i })).toBeInTheDocument();
  });

  it("should render forgot password link", () => {
    renderLogin();
    expect(screen.getByRole("link", { name: /forgot/i })).toBeInTheDocument();
  });

  it("should render signup link", () => {
    renderLogin();
    expect(screen.getByRole("link", { name: /sign/i })).toBeInTheDocument();
  });

  it("should allow to type into email and password inputs", async () => {
    renderLogin();
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);

    await userEvent.type(emailInput, "a");
    await userEvent.type(passwordInput, "a");
    expect(emailInput.value).toBe("a");
    expect(passwordInput.value).toBe("a");
  });

  it("should show-hide error message when email input is filled-empty", async () => {
    renderLogin();
    const loginButton = screen.getByRole("button", { name: /login/i });
    const emailInput = screen.getByLabelText(/email/i);
    await userEvent.clear(emailInput);
    expect(
      screen.queryByText(/^please enter your email$/i)
    ).not.toBeInTheDocument();
    await userEvent.click(loginButton);
    expect(screen.getByText(/^please enter your email$/i)).toBeInTheDocument();
  });

  it("should show-hide error message when password input is filled-empty", async () => {
    renderLogin();
    const loginButton = screen.getByRole("button", { name: /login/i });
    const passwordInput = screen.getByLabelText(/password/i);
    await userEvent.clear(passwordInput);
    expect(
      screen.queryByText(/^please enter your password$/i)
    ).not.toBeInTheDocument();
    await userEvent.click(loginButton);
    expect(
      screen.getByText(/^please enter your password$/i)
    ).toBeInTheDocument();
  });
});
