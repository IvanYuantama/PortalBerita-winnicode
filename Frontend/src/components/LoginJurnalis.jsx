import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logo from "../assets/logo.png";

const LoginJurnalis = () => {
  const [email, setEmail] = useState(""); // Menggunakan email
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  // navigate state
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("https://portal-berita-winnicode.vercel.app/user/loginJurnalis", {
        email,
        password,
      });

      const username = response.data.body.username;
      setMessage(response.data.message || "Login successful");

      if (response.status === 200) {
        // Menavigasi ke halaman /dashboard dengan membawa state email
        navigate("/dashboardJurnalis", {
          state: {
            username: username, // Mengirim email
          },
        });
      }
    } catch (error) {
      console.error(error);
      setMessage("Internal Server Error");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen" style={{ backgroundColor: "#1C1C1C" }}>
      <div className="p-8 rounded shadow-md w-full max-w-md flex flex-col justify-center" style={{ backgroundColor: "#FFFFFF" }}>
        <h2 className="text-2xl font-bold mb-6 text-center" style={{ color: "#000000" }}>
          Login Jurnalis
        </h2>

        {/* Logo */}
        <div className="flex justify-center mb-6">
          <a href="">
            <img src={logo} className="w-32 h-32" alt="Logo-FIM" border="0" />
          </a>
          {/* <img src="https://ibb.co.com/zr4SP3j" alt="Logo FIM" className="w-32 h-32" /> */}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2" htmlFor="email" style={{ color: "#333333" }}>
              Email
            </label>
            <input type="text" id="email" className="w-full p-2 border-2 rounded" style={{ borderColor: "#333333", color: "#000000" }} value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="mb-6">
            <label className="block mb-2" htmlFor="password" style={{ color: "#333333" }}>
              Password
            </label>
            <input type="password" id="password" className="w-full p-2 border-2 rounded" style={{ borderColor: "#333333", color: "#000000" }} value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          {message && (
            <p className="mb-4 text-center" style={{ color: "#FF0000" }}>
              {message}
            </p>
          )}
          <button type="submit" className="w-full py-2 rounded hover:bg-white hover:text-black border-2 border-black" style={{ backgroundColor: "#000000", color: "#FFFFFF" }}>
            Login
          </button>
        </form>

        <div className="text-center m-2">
          <a href="/registerJurnalis" className="text-sm duration-150 hover:text-gray-500" style={{ color: "#000000" }}>
            or Sign Up for new jurnalis
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginJurnalis;
