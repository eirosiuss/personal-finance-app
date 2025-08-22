import { useState } from "react";
import Input from "../Input.jsx";
import LoadingSpinner from "../LoadingSpinner";
import { useAuthStore } from "../../store/authStore.js";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { isLoading, forgotPassword } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await forgotPassword(email)
    setIsSubmitted(true)

  };

  return (
    <div>
      <div>
        <h2>Forgot Password</h2>
        {!isSubmitted ? (
          <form onSubmit={handleSubmit}>
            <label htmlFor="email">
              Enter your email address and we'll send you a link to reset your
              password
            </label>{" "}
            <Input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button className="cursor-pointer">
              {isLoading ? (
                <LoadingSpinner className="size-6 animate-spin mx-auto" />
              ) : (
                "Send Reset Link"
              )}
            </button>
          </form>
        ) : (
          <div className="text-center">
            <p>
              If an account exists for {email}, you will receive a password
              reset link shortly.
            </p>
          </div>
        )}
      </div>
      <div>
        <Link to={"/login"}>Back to login</Link>
      </div>
    </div>
  );
};

export default ForgotPassword;
