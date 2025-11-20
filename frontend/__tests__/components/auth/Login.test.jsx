// itr
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Login from "../../../src/components/auth/Login.jsx";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import SignUp from "../../../src/components/auth/SignUp.jsx";
import ForgotPassword from "../../../src/components/auth/ForgotPassword.jsx";

const MockLogin = () => {
  return (
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  );
};

describe("Login component", () => {
  it("should render header", () => {
    render(MockLogin());
    expect(screen.getByRole("heading", { name: /login/i })).toBeInTheDocument();
  });

  it("should render forgot password link", () => {
    render(MockLogin());
    expect(screen.getByRole("link", { name: /forgot/i })).toBeInTheDocument();
  });

  it("should render ForgotPassword component after pressing forgot-password link", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={["/login"]}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Routes>
      </MemoryRouter>
    );
    const forgotPasswordLink = screen.getByRole("link", { name: /forgot/i });
    await user.click(forgotPasswordLink);
    expect(
      screen.getByRole("heading", { name: /forgot/i })
    ).toBeInTheDocument();
  });

  it("should render signup link", () => {
    render(MockLogin());
    expect(screen.getByRole("link", { name: /sign/i })).toBeInTheDocument();
  });

  it("should render Signup component after pressing signup link", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={["/login"]}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      </MemoryRouter>
    );
    const signUpLink = screen.getByRole("link", { name: /sign/i });
    await user.click(signUpLink);
    expect(screen.getByRole("heading", { name: /sign/i })).toBeInTheDocument();
  });

  it("should allow to type into email and password inputs", async () => {
    render(MockLogin());
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
    render(MockLogin());
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
    render(MockLogin());
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
