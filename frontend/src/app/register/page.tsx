"use client";

import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Register() {
  const [data, setData] = useState<{
    email: string;
    password: string;
    confirmPassword: string;
    name: string;
    role: string;
    nif: number | null;
  }>({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    role: "Co-Producer",
    nif: null,
  });

  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  // To validate input fields on form
  const validateInputs = () => {
    if (!data.name.trim()) {
      setMessage("Name is required.");
      return false;
    }	

    if (data.name.length > 35) {
      setMessage("Name must have less than 35 characters.");
      return false;
    }

    if (data.nif === null || isNaN(data.nif)) {
      setMessage("NIF must be a valid number.");
      return false;
    }
    if (data.nif.toString().length !== 9) {
      setMessage("NIF must have 9 digits.");
      return false;
    }

    if (!data.email.trim()) {
      setMessage("Email is required.");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      setMessage("Invalid email format.");
      return false;
    }

    if (!data.password.trim()) {
      setMessage("Password is required.");
      return false;
    }

    if (data.password.length < 6) {
      setMessage("Password must have at least 6 characters.");
      return false;
    }

    if (data.password !== data.confirmPassword) {
      setMessage("Passwords do not match.");
      return false;
    }

    return true;
  };

  const register = async () => {
    if (!validateInputs()) {
      return;
    }

    try {
      const { data: user, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            role: data.role,
            nif: data.nif,
            name: data.name,
          },
        },
      });

      if (user) {
        router.push("/");
      } else if (error) {
        setMessage("Registration failed: " + error.message);
      }
    } catch (error) {
      setMessage("An error occurred: " + error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
  
    if (name === "nif") {
      // Allow only numbers or empty input, preserving the existing value
      const validValue = value === "" || /^\d*$/.test(value) ? value : data.nif?.toString() || ""; 
      setData((prev) => ({
        ...prev,
        [name]: validValue ? parseInt(validValue, 10) : null,  // Convert to number if valid
      }));
    } else {
      setData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="bg-gray-800 p-8 rounded-lg shadow-md w-[400px]">
        <h2 className="text-2xl font-bold mb-6 text-center text-white">Register</h2>
        <div className="grid mb-4">
          <label className="mb-2 text-gray-300">Name</label>
          <input
            type="text"
            name="name"
            value={data?.name}
            onChange={handleChange}
            className="p-2 border border-gray-600 rounded bg-gray-700 text-white"
          />
        </div>

        <div className="grid mb-6">
          <label className="mb-2 text-gray-300">NIF</label>
          <input
            type="tel"
            name="nif"
            value={data?.nif ?? ""}
            onChange={handleChange}
            maxLength={9}
            pattern="[0-9]{9}"
            className="p-2 border border-gray-600 rounded bg-gray-700 text-white"
          />
        </div>

        <div className="grid mb-4">
          <label className="mb-2 text-gray-300">Email</label>
          <input
            type="text"
            name="email"
            value={data?.email}
            onChange={handleChange}
            className="p-2 border border-gray-600 rounded bg-gray-700 text-white"
          />
        </div>
        <div className="grid mb-6">
          <label className="mb-2 text-gray-300">Password</label>
          <input
            type="password"
            name="password"
            value={data?.password}
            onChange={handleChange}
            className="p-2 border border-gray-600 rounded bg-gray-700 text-white"
          />
        </div>

        <div className="grid mb-4">
          <label className="mb-2 text-gray-300">Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={data?.confirmPassword}
            onChange={handleChange}
            className="p-2 border border-gray-600 rounded bg-gray-700 text-white"
          />
        </div>

        <div className="grid mb-6">
          <label className="mb-2 text-gray-300">Role</label>
          <select
            name="role"
            value={data?.role}
            onChange={handleChange}
            className="p-2 border border-gray-600 rounded bg-gray-700 text-white"
          >
            <option value="Producer">Producer</option>
            <option value="Co-Producer">Co-Producer</option>
          </select>
        </div>

        {message && <div className="mb-4 text-center text-red-500">{message}</div>}
        <div>
          <button
            onClick={register}
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-200"
          >
            Register
          </button>
        </div>
        <div className="mt-4 text-center">
          <button
            onClick={() => router.push("/")}
            className="text-blue-400 hover:underline"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}
