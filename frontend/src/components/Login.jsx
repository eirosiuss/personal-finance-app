import { useSignIn  } from "react-auth-kit";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login() {
    const [error, setError] = useState('')
    const [showPassword, setShowPassword] = useState(false)

    const signIn = useSignIn()

    const navigate = useNavigate()

    const submitFormHandler = (event) => {
        event.preventDefault()

        const userData = {
            username: event.target.username.value,
            password: event.target.password.value
        }

        axios.post(import.meta.env.VITE_BACKEND + '/auth/login', userData)
            .then(response => {
                // console.log(response)

                if (response.status == 200) {
                    if (signIn({
                        auth: {
                            token: response.data.token,
                            type: 'Bearer'
                        },
                        userState: response.data.user
                    })) {
                        navigate('/skelbimai/mano')
                    } else {
                        setError('Nepavyko prisijungti')
                    }
                }
            }).catch(err => {
                setError(err.response.data.message)
            })
    }

    return (
        <div>
            <h1>Prisijungti</h1>
            <p>Norėdami kurti skelbimus, turite prisijungti prie sistemos</p>
            <form onSubmit={submitFormHandler} onChange={() => setError('')}>
                <div>
                    <label htmlFor="usernameInput">Vartotojo vardas:</label>
                    <input type="text" id="usernameInput" name="username" />
                </div>
                <div>
                    <label htmlFor="passwordInput">Slaptažodis:</label>
                    <input type={ showPassword ? "text" : "password" } id="passwordInput" name="password" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}>
                        { !showPassword && <EyeClosed size={16} /> }
                        { showPassword && <Eye size={16} /> }
                    </button>
                </div>
                {
                    error &&
                    <div style={{ color: 'red' }}>
                        <p>{error}</p>
                    </div>
                }
                <div>
                    <button type="submit">Prisijungti</button>
                </div>
            </form>
        </div>
    )
}