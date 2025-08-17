import { useState } from "react";
import Input from "../Input.jsx";
import { Link } from "react-router-dom";

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordLengthError, setPasswordLengthError] = useState(false);
  const handleSignUp = (e) => {
    e.preventDefault();
    if (password.length < 8) {
      setPasswordLengthError(true);
      return;
    }
    setPasswordLengthError(false);
  };
  return (
    <div className="text-center">
      <div>
        <h2>Sign Up</h2>

        <form onSubmit={handleSignUp}>
          <label htmlFor="name">Name</label>
          <Input
            type="text"
            name="name"
            value={name}
            className="border"
            onChange={(e) => setName(e.target.value)}
          />
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
              setPasswordLengthError(false);
            }}
          />
          {passwordLengthError && (
            <p className="text-red-500">
              Password must be at least 8 characters
            </p>
          )}
          <button type="submit" className="cursor-pointer">
            Create Account
          </button>
        </form>
      </div>
      <div>
        <p>
          Need to create an account?
          <Link to={"/login"}> Login</Link>
        </p>
      </div>
    </div>
  );
}
