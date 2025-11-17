import { useState } from "react";
import { useAuthStore } from "../../store/authStore.js";
import { Link } from "react-router-dom";
import LogoFinance from "../../../src/assets/images/logo-large.svg";
import Input from "../shared/Input.jsx";
import ButtonPrimary from "../shared/ButtonPrimary.jsx";
import Logo from "../../../src/assets/images/login-and-signup-illustration-image.svg";
import Header from "../shared/Header.jsx";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { isLoading, forgotPassword } = useAuthStore();

  const handleChange = (e) => {
    setEmailError(null);
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setEmailError("Please enter your email");
      return;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    setIsSubmitted(true);
    await forgotPassword(email);
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
          <Header title="Forgot Password"></Header>
          {!isSubmitted ? (
            <>
              <form onSubmit={handleSubmit} noValidate>
                <div className="w-full mt-8">
                  <label
                    className="preset-5-bold text-grey-500"
                    htmlFor="email"
                  >
                    Enter your email address and we'll send you a link to reset
                    your password
                  </label>
                  <Input
                    type="email"
                    name="email"
                    value={email}
                    onChange={handleChange}
                  />
                  <div className="h-4">
                    {emailError && (
                      <p className="text-red-500 preset-4-bold">{emailError}</p>
                    )}
                  </div>
                </div>
                <ButtonPrimary
                  className="w-full"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? "Sending..." : "Send Reset Link"}
                </ButtonPrimary>
              </form>
              <p className="preset-4 text-grey-500 text-center">
                Back to{" "}
                <Link
                  className="preset-4-bold underline [text-decoration-skip-ink:none] text-grey-500 hover:text-gray-500"
                  to={"/login"}
                >
                  {" "}
                  login
                </Link>
              </p>
            </>
          ) : (
            <div className="w-full mt-8">
              <p className="preset-4 text-grey-900">
                If an account exists for{" "}
                <span className="preset-4-bold">{email}</span>, you will receive
                a password reset link shortly.
              </p>
              <p className="preset-4 text-grey-500 mt-8">
                Back to{" "}
                <Link
                  className="preset-4-bold underline [text-decoration-skip-ink:none] text-grey-500 hover:text-gray-500"
                  to={"/login"}
                >
                  {" "}
                  login
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
