import { useState } from "react";
import { Link } from "react-router-dom";
import Input from "../Input.jsx";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
  };
  return (
    <div className="max-w-md w-full">
      <div className="p-8">
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
          <button type="submit" className="cursor-pointer block">
            Login
          </button>
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
