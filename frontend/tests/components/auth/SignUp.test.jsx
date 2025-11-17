import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import SignUp from "../../../src/components/auth/SignUp.jsx";
import Login from "../../../src/components/auth/Login.jsx";

const mockSignUp = () => {
  return (
    <MemoryRouter>
      <SignUp />
    </MemoryRouter>
  );
};

describe("SignUp component", () => {
  it("should render header", () => {
    render(mockSignUp());
    expect(screen.getByRole("heading", { name: /sign/i })).toBeInTheDocument();
  });

  it("should render login link", () => {
    render(mockSignUp());
    expect(screen.getByRole("link", { name: /login/i }));
  });

  it("should render Login component after pressing login link", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={["/signup"]}>
        <Routes>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </MemoryRouter>
    );
    const loginLink = screen.getByRole("link", { name: /login/i });
    await user.click(loginLink);
    expect(screen.getByRole("heading", { name: /login/i })).toBeInTheDocument();
  });

  it("should allow to type into name, email and password inputs", async () => {
    render(mockSignUp());
    const nameInput = screen.getByRole("textbox", { name: /name/i });
    const emailInput = screen.getByRole("textbox", {
      name: /email/i,
    });
    const passwordInput = screen.getByLabelText(/password/i);
    await userEvent.type(nameInput, "a");
    await userEvent.type(emailInput, "a");
    await userEvent.type(passwordInput, "a");
    expect(nameInput.value).toBe("a");
    expect(emailInput.value).toBe("a");
    expect(passwordInput.value).toBe("a");
  });

  it("should show error message when name input is empty", async () => {
    render(mockSignUp());
    const signUpButton = screen.getByRole("button", { name: /create/i });
    const nameInput = screen.getByRole("textbox", { name: /name/i });
    await userEvent.clear(nameInput);
    expect(
      screen.queryByText(/^please enter your name$/i)
    ).not.toBeInTheDocument();
    await userEvent.click(signUpButton);
    expect(screen.getByText(/^please enter your name$/i)).toBeInTheDocument();
  });

  it("should show error message when email input is empty", async () => {
    render(mockSignUp());
    const signUpButton = screen.getByRole("button", { name: /create/i });
    const emailInput = screen.getByRole("textbox", {
      name: /email/i,
    });
    await userEvent.clear(emailInput);
    expect(
      screen.queryByText(/^please enter your email$/i)
    ).not.toBeInTheDocument();
    await userEvent.click(signUpButton);
    expect(screen.getByText(/^please enter your email$/i)).toBeInTheDocument();
  });

  it("should show error message when password input is less than 8 characters long", async () => {
    render(mockSignUp());
    const signUpButton = screen.getByRole("button", { name: /create/i });
    const passwordInput = screen.getByLabelText(/password/i);
    await userEvent.clear(passwordInput);
    expect(
      screen.queryByText(/^password must be at least 8 characters$/i)
    ).not.toBeInTheDocument();
    await userEvent.click(signUpButton);
    expect(
      screen.getByText(/^password must be at least 8 characters$/i)
    ).toBeInTheDocument();
  });
});
