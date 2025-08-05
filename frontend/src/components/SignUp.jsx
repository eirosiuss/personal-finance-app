import { useSignIn } from "react-auth-kit";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function SignUp() {
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const signIn = useSignIn();

  const navigate = useNavigate();

  const submitFormHandler = (event) => {
    event.preventDefault();
    // alert('submitinam forma')
    // console.log(event.target.username.value)

    const userData = {
      username: event.target.username.value,
      password: event.target.password.value,
    };
    // console.log(userData);

    // fetch('http://localhost:9858/auth/register', { method: 'POST', body: JSON.stringify(userData) })

    axios
      .post(import.meta.env.VITE_BACKEND + "/auth/sign-up", userData)
      .then((response) => {
        console.log(response);

        if (response.status === 201) {
          // alert('Registracija sėkminga')
          if (
            signIn({
              auth: {
                token: response.data.token,
                type: "Bearer",
              },
              userState: response.data.user,
            })
          ) {
            // Redirect or do-something
            // alert('sekmingai')
            navigate("/skelbimai/mano");
          } else {
            //Throw error
            // alert('nesekmingai')
            setError("Nepavyko prisijungti");
          }
        }
      })
      .catch((err) => {
        // console.log(err);
        // console.log(err.response.data.message);
        setError(err.response.data.message);
      });
  };

  return (
    <div>
      <h1>Registruotis</h1>
      <p>Norėdami kurti skelbimus, turite prisijungti prie sistemos</p>
      <form onSubmit={submitFormHandler} onChange={() => setError("")}>
        <div>
          <label htmlFor="usernameInput">Vartotojo vardas:</label>
          <input type="text" id="usernameInput" name="username" />
        </div>
        <div>
          <label htmlFor="passwordInput">Slaptažodis:</label>
          <input
            type={showPassword ? "text" : "password"}
            id="passwordInput"
            name="password"
          />
          <button type="button" onClick={() => setShowPassword(!showPassword)}>
            {!showPassword && <EyeClosed size={16} />}
            {showPassword && <Eye size={16} />}
          </button>
        </div>
        {error && (
          <div style={{ color: "red" }}>
            <p>{error}</p>
          </div>
        )}
        <div>
          <button type="submit">Registruotis</button>
        </div>
      </form>
    </div>
  );
};