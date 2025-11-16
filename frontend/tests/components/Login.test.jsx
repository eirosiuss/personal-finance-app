// itr
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import Login from "../../src/components/auth/Login.jsx";
import HomePage from "../../src/components/homePage/HomePage.jsx";
import { useAuthStore } from "../../src/store/authStore.js";

const renderLogin = () =>
  render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  );

describe("Login Component", () => {
  it("should render header", () => {
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
    const emailInput = screen.getByRole("textbox", {
      name: /email/i,
    });
    const passwordInput = screen.getByLabelText(/password/i);

    await userEvent.type(emailInput, "a");
    await userEvent.type(passwordInput, "a");
    expect(emailInput.value).toBe("a");
    expect(passwordInput.value).toBe("a");
  });

  it("should show error message when email input is empty", async () => {
    renderLogin();
    const loginButton = screen.getByRole("button", { name: /login/i });
    const emailInput = screen.getByRole("textbox", {
      name: /email/i,
    });
    await userEvent.clear(emailInput);
    expect(
      screen.queryByText(/^please enter your email$/i)
    ).not.toBeInTheDocument();
    await userEvent.click(loginButton);
    expect(screen.getByText(/^please enter your email$/i)).toBeInTheDocument();
  });

  it("should show error message when password input is empty", async () => {
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

it("redirects to home page after successful login", async () => {

});

});
