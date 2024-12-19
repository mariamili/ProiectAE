import { useState } from "react";
import { loginUser } from "../routes/auth";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLoggedIn, setToken } from "../store/slices/globalSlice";
import "./login.css";
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async () => {
    const response = await loginUser(email, password);
    console.log(response);
    if (response.success) {
      localStorage.setItem("token", response.data.token);
      const token = response.data.token;
      localStorage.setItem("email",response.data.email);
      localStorage.setItem("name",response.data.name);
      localStorage.setItem("dateJoined",response.data.dateJoined);

      navigate("/");
      dispatch(setLoggedIn(true));
      dispatch(setToken(response.data.token));
    } else {
        toast.error('Invalid credentials');
    }
  };

  const handleRegister = async () => {
    navigate("/register");
  }

  return (
    <div className="formWrapper">
  <h2>Login to Your Account</h2>
  <label htmlFor="email">Email</label>
  <input
    type="text"
    id="email"
    name="email"
    placeholder="Your email.."
    className="formInput"
    onChange={(e) => setEmail(e.target.value)}
  />

  <label htmlFor="password">Password</label>
  <input
    type="password"
    id="password"
    name="password"
    placeholder="Your password.."
    className="formInput"
    onChange={(e) => setPassword(e.target.value)}
  />

  <div className="loginButtonsWrapper">
    <button className="green-button" onClick={handleLogin}>
      Login
    </button>
    <button className="blue-button" onClick={handleRegister}>
      Register
    </button>
  </div>
</div>

  );
}

export default Login;
