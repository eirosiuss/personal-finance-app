import { useState } from "react";
import Input from "../shared/Input.jsx";
import ButtonPrimary from "../shared/ButtonPrimary.jsx";
import { Link } from "react-router-dom";
import { useAuthStore } from "../../store/authStore.js";
import { useNavigate } from "react-router-dom";
import LogoFinance from "../../../src/assets/images/logo-large.svg";
import LogoSignUp from "../../../src/assets/images/login-and-signup-illustration-image.svg";
import { Icon } from "@iconify/react";

export default function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const { signup, error, isLoading } = useAuthStore();
  const [formError, setFormError] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const validate = () => {
    const errors = {};
    if (!formData.name) {
      errors.name = "Please enter your name";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }
    if (!formData.email) {
      errors.email = "Please enter your email";
    }
    if (formData.password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    }
    return errors;
  };

  const handleChange = (e) => {
    useAuthStore.setState({ error: null });
    const name = e.target.name;
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setFormError((prev) => ({ ...prev, [name]: null }));
    useAuthStore.setState({ error: null });
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length) {
      setFormError(errors);
      return;
    }
    useAuthStore.setState({ isLoading: true });

    try {
      await signup(formData.email, formData.password, formData.name);
      navigate("/verify-email");
    } catch (error) {
      console.log(error);
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
            src={LogoSignUp}
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
          <h2 className="preset-1 text-grey-900">Sign Up</h2>
          <form onSubmit={handleSignUp} noValidate>
            <div className="w-full mt-8">
              <label className="preset-5-bold text-grey-500" htmlFor="name">
                Name
              </label>
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
              <div className="h-4">
                {formError.name && (
                  <p className="text-red-500 preset-4-bold">{formError.name}</p>
                )}
              </div>
            </div>
            <div>
              <label className="preset-5-bold text-grey-500" htmlFor="email">
                Email
              </label>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
              <div className="h-4">
                {formError.email && (
                  <p className="text-red-500 preset-4-bold">
                    {formError.email}
                  </p>
                )}
              </div>
            </div>
            <div>
              <label className="preset-5-bold text-grey-500" htmlFor="password">
                Create password
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
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
                {formError.password && (
                  <p className="text-red-500 preset-4-bold">
                    {formError.password}
                  </p>
                )}
                {error && <p className="text-red-500 preset-4-bold">{error}</p>}
              </div>
            </div>
            <ButtonPrimary type="submit" disabled={isLoading}>
              {isLoading ? "Signing Up..." : "Create Account"}
            </ButtonPrimary>
          </form>
          <p className="preset-4 text-grey-500 text-center">
            Already have an account?{" "}
            <Link
              className="preset-4-bold underline [text-decoration-skip-ink:none] text-grey-500 hover:text-gray-500"
              to={"/login"}
            >
              {" "}
              Login
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
