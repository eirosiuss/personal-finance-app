import { useState } from "react";
import { useAuthStore } from "../../store/authStore";
import { useNavigate, useParams } from "react-router";
import Input from "../shared/Input.jsx";
import toast from "react-hot-toast";
import LogoFinance from "../../../src/assets/images/logo-large.svg";
import ButtonPrimary from "../shared/ButtonPrimary.jsx";
import Logo from "../../../src/assets/images/login-and-signup-illustration-image.svg";
import Header from "../shared/Header.jsx";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState("");
  const { resetPassword, error, isLoading, message } = useAuthStore();

  const { token } = useParams();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setPasswordError(null);
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      return;
    }

    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    try {
      await resetPassword(token, password);
      toast.success(
        "Password reset successfully, redirecting to login page..."
      );
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Error resetting password");
    }
  };

  return (
    <>
      <div className="bg-grey-900 h-16 block lg:hidden rounded-b-xl relative">
        <img
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          src={LogoFinance}
          alt="Logo Finance"
        />
      </div>
      <div className="flex items-center justify-between min-h-screen">
        <div className="relative lg:block hidden">
          <img
            className="absolute top-16 left-16"
            src={LogoFinance}
            alt="Logo Finance"
          />
          <img
            className="p-5 max-h-screen rounded-4xl"
            src={Logo}
            alt="Abstract login and signup screen illustration with a blue color scheme and a stylized person."
          />
          <div className="absolute bottom-16 left-16 text-balance text-white">
            <p className="preset-1 mb-6">
              Keep track of your money and save for your future
            </p>
            <p className="preset-4">
              Personal finance app puts you in control of your spending. Track
              transactions, set budgets, and add to savings pots easily.
            </p>
          </div>
        </div>
        <div className="m-auto w-[560px] p-8 bg-white rounded-xl max-sm:m-5">
          <Header title='Reset Password'></Header>
          <form className="w-full mt-8" onSubmit={handleSubmit}>
            <Input
              type="password"
              placeholder="New Password"
              value={password}
              onChange={handleChange}
              className="mb-8"
            />
            <Input
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <div className="h-4">
              {passwordError && (
                <p className="text-red-500 preset-4-bold">{passwordError}</p>
              )}
              {error && <p className="text-red-500 preset-4-bold">{error}</p>}
              {message && (
                <p className="text-red-500 preset-4-bold">{message}</p>
              )}
            </div>
            <ButtonPrimary
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Reseting..." : "Set New Password"}
            </ButtonPrimary>
          </form>
        </div>
      </div>
    </>
  );
};

export default ResetPassword;
