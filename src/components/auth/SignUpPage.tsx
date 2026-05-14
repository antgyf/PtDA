import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/AuthContext";
import { useAlert } from "../../hooks/AlertContext";
import { AxiosError } from "axios";
import api from "../../api/api";
import TextInput from "../UI/Form/TextInput";
import Alert from "../UI/Alert";

interface SignUpInterface {
  username: string;
  password: string;
  confirmPassword: string;
}

const SignUpForm: React.FC = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const { alert, showAlert } = useAlert();

  const [form, setForm] = useState<SignUpInterface>({
    username: "",
    password: "",
    confirmPassword: "",
  });

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitEvent = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!form.username || !form.password) {
      showAlert("Please provide valid inputs.", "error");
      return;
    }

    if (form.password !== form.confirmPassword) {
      showAlert("Passwords do not match. Please try again.", "error");
      return;
    }

    try {
      showAlert("Signing up...", "info");

      const response = await api.post(
        `/${auth.isSurgeon ? "surgeons" : "researchers"}/create`,
        {
          username: form.username,
          password: form.password,
        },
        { headers: { "Content-Type": "application/json" } , withCredentials: true }
      );

      // Set auth context
      if (auth.isSurgeon) {
        auth.login(form.username, +response.data.surgeonid);
      } else {
        auth.login(form.username, -2);
      }

      showAlert(response.data.message, "success");
      navigate("/home");
    } catch (error) {
      if (error instanceof AxiosError) {
        showAlert(error.response?.data.message, "error");
      } else {
        showAlert("An unexpected error occurred", "error");
      }
      console.error(error);
    }
  };

  return (
    <div
      className={`w-screen h-screen flex flex-col items-center justify-center overflow-hidden ${
        auth.isSurgeon ? "bg-neutral" : "bg-secondary"
      }`}
    >
      {alert.message && <Alert />}
      <article className="prose prose-xl text-center py-10 w-full max-w-2xl">
        <h1 className="my-2">PRECEDE-PtDA</h1>
        <h1>{auth.isSurgeon ? "Surgeon" : "Researcher"} Sign Up</h1>
      </article>

      <form onSubmit={handleSubmitEvent} className="w-full px-2 max-w-sm">
        <TextInput label="Username" name="username" onChange={handleInput} />

        <TextInput
          label="Password"
          name="password"
          onChange={handleInput}
          password
        />
        <TextInput
          label="Confirm Password"
          name="confirmPassword"
          onChange={handleInput}
          password
        />

        <button
          type="submit"
          className={`w-full my-5 py-2 btn text-lg text-white ${
            auth.isSurgeon ? "btn-primary" : "btn-accent"
          }`}
        >
          Sign up
        </button>
      </form>

      <Link className="font-bold underline" to="/login">
        Already have an account? Log in
      </Link>
      <button
        className={`text-white text-[16px] p-4 mt-5 ${
          auth.isSurgeon ? "btn-accent" : "btn-primary"
        }`}
        onClick={() => auth.toggleIsSurgeon()}
      >
        {auth.isSurgeon ? "Researcher" : "Surgeon"} Signup
      </button>
    </div>
  );
};

export default SignUpForm;
