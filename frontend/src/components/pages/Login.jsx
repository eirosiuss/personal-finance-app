import { useState } from "react";
import { Link } from "react-router-dom";
import Input from "../Input.jsx";
import { useAuthStore } from "../../../store/authStore.js";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const {login, isloading, error} = useAuthStore()

  const handleLogin = async (e) => {
    e.preventDefault();
    await login (email, password);
  };

  return (
    <div className="text-center">
      <div>
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <label htmlFor="email">Email</label>
          <Input
            type="email"
            name="email"
            value={email}
            className="border"
            onChange={(e) => setEmail(e.target.value)}
          />
          <label htmlFor="password">Password</label>
          <Input
            type="password"
            name="password"
            value={password}
            className="border"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <Link to="/forgot-password">Forgot password?</Link>
            {error && <p className="text-red-500">{error}</p>}
          <div>
            <button type="submit" className="cursor-pointer">
              Login
            </button>
          </div>
          <p>
            Already have an account?
            <Link to={"/signup"}> Sign Up</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
