import React, { useState } from "react";
import { signup } from "../services/api";
import toast from "react-hot-toast";

const Signup = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await signup(form);
    if (res.message === "User created successfully ✅") {
      toast.success("Signup successful 🎉");
    } else {
      toast.error(res.message || "Signup failed");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4 bg-white rounded shadow">
      <input name="name" placeholder="Name" onChange={handleChange} value={form.name} className="border p-2 w-full" />
      <input name="email" type="email" placeholder="Email" onChange={handleChange} value={form.email} className="border p-2 w-full" />
      <input name="password" type="password" placeholder="Password" onChange={handleChange} value={form.password} className="border p-2 w-full" />
      <button type="submit" className="bg-violet-800 text-white p-2 rounded">Sign Up</button>
    </form>
  );
};

export default Signup;
