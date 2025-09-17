import React, { useState } from "react";
import { login } from "../services/api";
import toast from "react-hot-toast";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await login(form);
    if (res.token) {
      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));
      toast.success("Login successful 🎉");
    } else {
      toast.error(res.message || "Login failed");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4 bg-white rounded shadow">
      <input name="email" type="email" placeholder="Email" onChange={handleChange} value={form.email} className="border p-2 w-full" />
      <input name="password" type="password" placeholder="Password" onChange={handleChange} value={form.password} className="border p-2 w-full" />
      <button type="submit" className="bg-violet-800 text-white p-2 rounded">Login</button>
    </form>
  );
};

export default Login;
