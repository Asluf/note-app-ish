import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthService } from "../services/authService";
import { NoteContext } from "../contexts/NoteContext";
import Swal from "sweetalert2";
import Navbar from "./NavBar";
import { useTokenContext } from "../contexts/TokenContext";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { token, setToken, setUserId } = useTokenContext();
  const noteContext = useContext(NoteContext);

  if (!noteContext) {
    throw new Error("NoteList must be used within a NoteProvider");
  }
  const { fetchProjectInitial, fetchProject } = noteContext;

  useEffect(() => {
    if (token && token !== '') {
      fetchProject(token);
      console.log('fetching');
      navigate('/dashboard');
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await AuthService.login(email, password);
      const tk = response.data.token;
      const userId = response.data.userId;
      setToken(tk);
      setUserId(userId);
      localStorage.setItem('token', tk);
      localStorage.setItem('userId', userId);
      fetchProjectInitial(tk);
      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      setError("Login failed. Please check your credentials.");
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: "Login failed. Please check your credentials.",
        showConfirmButton: false,
        timer: 1500
      });
    }
  };

  return (
    <div className="w-[100%] h-[100vh]">
      {/* Navbar */}
      <Navbar path={location.pathname} />
      {/* body */}
      <div className="w-[100%] h-[92vh] flex justify-center items-center">
        <div className="bg-brown-300 bg-opacity-50 w-[450px] h-[350px] rounded-xl px-10 py-5 shadow-xl flex flex-col gap-4 ">
          <h2 className="font-bold text-2xl flex justify-center items-center">Login</h2>
          <form onSubmit={handleLogin}>
            <div className="flex w-[100%] gap-2 mt-4 mb-6 items-center">
              <label htmlFor="email" className="w-[20%]">Email</label>
              <input
                type="email"
                id="email"
                className="w-[80%] py-2 px-3 rounded-lg bg-brown-100"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="flex w-[100%] gap-2 mb-6 items-center">
              <label htmlFor="password" className="w-[20%]">Password</label>
              <input
                type="password"
                id="password"
                className="w-[80%] py-2 px-3 rounded-lg bg-brown-100"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="flex justify-center items-center mt-5">
              <button type="submit" className="py-2 px-4 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-brown-900 text-white hover:bg-brown-600">
                Login
              </button>
            </div>
            <div className="text-center mt-3">
              {error && <div className="alert alert-danger mt-3">{error}</div>}
              <span>Don't have an account? </span>
              <Link to="/signup" className="text-blue-500 underline">Sign Up</Link>
            </div>
          </form>
        </div>
      </div>
    </div>

  );
};

export default Login;
