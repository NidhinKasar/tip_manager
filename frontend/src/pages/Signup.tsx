import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { signupUser } from "../services/api.ts";
import { useNavigate } from "react-router-dom";

const SignupPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    image: null as File | null, // New state for profile image
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    image: "",
  });
  
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationKey: ["Signup"],
    mutationFn: (newUser: { name: string; email: string; password: string; image: File | null }) =>
      signupUser(newUser),
    onSuccess: (data) => {
      setSuccess("Signup successful!");
      setErrors({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        image: "",
      });
      setFormData({ name: "", email: "", password: "", confirmPassword: "", image: null });
      navigate('/login');
    },
    onError: (err: any) => {
      setSuccess(null);
      // Handle other error scenarios
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (name === "profileImage") {
      setFormData({
        ...formData,
        image: files ? files[0] : null,
      });
      setErrors({ ...errors, image: "" }); // Clear image error
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
      setErrors({ ...errors, [name]: "" }); // Clear specific field error
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { name, email, password, confirmPassword, image } = formData;
    let valid = true;

    // Reset errors
    setErrors({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      image: "",
    });

    if (!name) {
      setErrors(prev => ({ ...prev, name: "Name is required." }));
      valid = false;
    }
    if (!email) {
      setErrors(prev => ({ ...prev, email: "Email is required." }));
      valid = false;
    }
    if (!password) {
      setErrors(prev => ({ ...prev, password: "Password is required." }));
      valid = false;
    }
    if (!confirmPassword) {
      setErrors(prev => ({ ...prev, confirmPassword: "Please confirm your password." }));
      valid = false;
    }
    if (password !== confirmPassword) {
      setErrors(prev => ({ ...prev, confirmPassword: "Passwords do not match." }));
      valid = false;
    }
    if (!image) {
      setErrors(prev => ({ ...prev, image: "Profile image is required." }));
      valid = false;
    }

    if (valid) {
      mutation.mutate({ name, email, password, image });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white border border-gray-200 shadow-md rounded-lg">
        <h2 className="text-3xl font-bold text-center text-grey-900 mb-6">Sign Up</h2>

        {success && <p className="text-green-500 text-center mb-4">{success}</p>}
        {mutation.isPending && <p className="text-blue-500 text-center mb-4">Signing up...</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleInputChange}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Your name"
            />
            {errors.name && <p className="text-red-500">{errors.name}</p>}
          </div>
          <div>
            <label htmlFor="profileImage" className="block text-sm font-medium text-gray-700">
              Profile Image
            </label>
            <input
              id="profileImage"
              name="profileImage"
              type="file"
              accept="image/*" // Accepts image files only
              onChange={handleInputChange}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            {errors.image && <p className="text-red-500">{errors.image}</p>}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="you@example.com"
            />
            {errors.email && <p className="text-red-500">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="********"
            />
            {errors.password && <p className="text-red-500">{errors.password}</p>}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="********"
            />
            {errors.confirmPassword && <p className="text-red-500">{errors.confirmPassword}</p>}
          </div>

          <div>
            <button
              type="submit"
              className="w-full py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? "Processing..." : "Sign Up"}
            </button>
          </div>
        </form>

        <p className="text-sm text-center text-gray-600 mt-6">
          Already have an account?{" "}
          <a href="/login" className="text-indigo-600 hover:text-indigo-500">
            Log in
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
