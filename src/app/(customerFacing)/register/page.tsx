'use client';

import React, { useState } from "react";

const registerUser = async (name: string, email: string, password: string) => {
  try {
    const response = await fetch('/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });
    if (!response.ok) {
      throw new Error('Failed to register user');
    }
    return response.json();
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleRegister = async () => {
    try {
      await registerUser(name, email, password);
      setSuccess("User registered successfully!");
      setError(null);
    } catch (error) {
      setError("Failed to register user");
      setSuccess(null);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6">Register</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {success && <p className="text-green-500 mb-4">{success}</p>}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            className="mt-1 p-2 border border-gray-300 rounded w-full"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            className="mt-1 p-2 border border-gray-300 rounded w-full"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            className="mt-1 p-2 border border-gray-300 rounded w-full"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded"
          onClick={handleRegister}
        >
          Register
        </button>
      </div>
    </div>
  );
}