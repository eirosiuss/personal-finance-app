import { useState } from "react";
import { Link } from "react-router-dom";
import Input from "../shared/Input.jsx";
import ButtonPrimary from "../shared/ButtonPrimary.jsx";
import LogoLogin from "../../../src/assets/images/login-and-signup-illustration-image.svg";
import LogoFinance from "../../../src/assets/images/logo-large.svg";
import { Icon } from "@iconify/react";
import Header from "../shared/Header.jsx";
import { useDispatch, useAuthStore } from "../../context/AuthContext.jsx";

const Login = () => {
  const dispatch = useDispatch();
  const { login } = useAuthStore();

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [formErrors, setFormErrors] = useState({
    email: null,
    password: null,
  });

  const handleChange = (e) => {
    dispatch({
      type: "reset_error",
    });
    const name = e.target.name;
    const value = e.target.value;
    setFormErrors({
      ...formErrors,
      [name]: null,
    });
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
      setFormErrors({
        email: "Please enter your email",
        password: "Please enter your password",
      });
      return;
    } else if (!formData.email) {
      setFormErrors({
        email: "Please enter your email",
      });
      return;
    } else if (!validateEmail(formData.email)) {
      setFormErrors({
        email: "Please enter a valid email address",
      });
      return;
    } else if (!formData.password) {
      setFormErrors({
        password: "Please enter your password",
      });
      return;
    }
    login(formData);
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
          <Header title="Login"></Header>
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
                onChange={handleChange}
              />
              <div className="h-4">
                {formErrors && (
                  <p className="text-red-500 preset-4-bold">
                    {formErrors.email}
                  </p>
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
                  onChange={handleChange}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1/2 right-5 -translate-y-1/2 text-black"
                >
                  {showPassword ? (
                    <Icon icon="mdi-eye" width="16" height="16" />
                  ) : (
                    <Icon icon="mdi:eye-off" width="16" height="16" />
                  )}
                </button>
              </div>
              <div className="h-4">
                {formErrors && (
                  <p className="text-red-500 preset-4-bold">
                    {formErrors.password}
                  </p>
                )}
                {/* {error && <p className="text-red-500 preset-4-bold">{error}</p>} */}
              </div>
            </div>
            <Link
              className="preset-4-bold underline [text-decoration-skip-ink:none] text-grey-900 hover:text-grey-500"
              to="/forgot-password"
            >
              Forgot password?
            </Link>
            <ButtonPrimary
              className="w-full"
              type="submit"
              // disabled={isLoading}
            >
              {/* {isLoading ? "Loading..." : "Login"} */}
              Login
            </ButtonPrimary>
          </form>
          <p className="preset-4 text-grey-500 text-center">
            Need to create an account?{" "}
            <Link
              className="preset-4-bold underline [text-decoration-skip-ink:none] text-grey-500 hover:text-gray-500"
              to={"/signup"}
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;
