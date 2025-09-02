import { useState } from "react";
import { Link } from "react-router-dom";
import Input from "../Input.jsx";
import { useAuthStore } from "../../store/authStore.js";
import LogoLogin from "../../../src/assets/images/login-and-signup-illustration-image.svg";
import LogoFinance from "../../../src/assets/images/logo-large.svg";
import { Eye, EyeOff } from "lucide-react";

const Login = () => {
  const { login, isLoading, error } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [emailError, setEmailError] = useState();
  const [passwordError, setPasswordError] = useState();

  const handleChange = (e) => {
    useAuthStore.setState({ error: null });
    setEmailError(false);
    setPasswordError(false);
    const name = e.target.name;
    const value = e.target.value;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!formData.email && !formData.password) {
      setEmailError("Please enter your email");
      setPasswordError("Please enter your password");
      return;
    }

    if (!formData.email) {
      setEmailError("Please enter your email");
      return;
    }

    if (!validateEmail(formData.email)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    if (!formData.password) {
      setPasswordError("Please enter your password");
      return;
    }

    useAuthStore.setState({ isLoading: true });

    await login(formData.email, formData.password);
  };

  return (
    <>
      <div className="bg-grey-900 h-16 max-md:block hidden rounded-b-xl relative">
        <img
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          src={LogoFinance}
          alt="Logo Finance"
        />
      </div>
      <div className="flex items-center justify-between min-h-screen">
        <div className="relative md:block hidden">
          <img
            className="absolute top-16 left-16"
            src={LogoFinance}
            alt="Logo Finance"
          />
          <img
            className="p-5 max-h-screen rounded-4xl"
            src={LogoLogin}
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
          <h2 className="preset-1 text-grey-900">Login</h2>
          <form onSubmit={handleLogin} noValidate>
            <div className="w-full mt-8">
              <label className="preset-5-bold text-grey-500" htmlFor="email">
                Email
              </label>
              <Input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                className="preset-4 border border-beige-500 w-full rounded-lg px-5 py-3 text-grey-900 font-preset-4"
                onChange={handleChange}
              />
              <div className="h-4">
                {emailError && (
                  <p className="text-red-500 preset-4-bold">{emailError}</p>
                )}
              </div>
            </div>
            <div>
              <label className="preset-5-bold text-grey-500" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  className="preset-4 border border-beige-500 w-full rounded-lg px-5 py-3 text-grey-900 font-preset-4"
                  onChange={handleChange}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1/2 right-5 -translate-y-1/2 text-black"
                >
                  {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                </button>
              </div>
              <div className="h-4">
                {passwordError && (
                  <p className="text-red-500 preset-4-bold">{passwordError}</p>
                )}
              </div>
            </div>
            <Link
              className="preset-4-bold underline [text-decoration-skip-ink:none] text-grey-900"
              to="/forgot-password"
            >
              Forgot password?
            </Link>
            <div className="h-4">
              <div>
                {error && <p className="text-red-500 preset-4-bold">{error}</p>}
              </div>
            </div>
            <div>
              <button
                type="submit"
                className={`preset-4-bold text-white cursor-pointer w-full mt-3 mb-8 py-4 rounded-lg 
    ${isLoading ? "bg-black" : "bg-grey-900 hover:bg-black"}`}
                disabled={isLoading}
              >
                {isLoading ? "Loading..." : "Login"}
              </button>
            </div>
            <p className="preset-4 text-grey-500 text-center">
              Need to create an account?
              <Link
                className="preset-4-bold underline [text-decoration-skip-ink:none] text-grey-900"
                to={"/signup"}
              >
                {" "}
                Sign Up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
