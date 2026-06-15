import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/AuthContext";
import { useAlert } from "../../hooks/AlertContext";
import { AxiosError } from "axios";
import api from "../../api/api";
import TextInput from "../UI/Form/TextInput";
import Alert from "../UI/Alert";

interface LoginFormInterface {
  username: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const { alert, showAlert } = useAlert();

  const [form, setForm] = useState<LoginFormInterface>({
    username: "",
    password: "",
  });

  const handleSubmitEvent = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (form.username !== "" && form.password !== "") {
      try {
        showAlert("Logging in...", "info");

        // Attempt login (cookie will be set on success)
        const response = await api.post(
          `/${auth.isSurgeon ? "surgeons" : "researchers"
          }/login`,
          {
            username: form.username,
            password: form.password,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true, // Ensure cookies are sent with the request
          }
        );

        // Fetch current user info using cookie
        const userRes = await api.get(
          `/${auth.isSurgeon ? "surgeons" : "researchers"}/me`,
          { withCredentials: true }
        );

        const user = userRes.data;
        const id = auth.isSurgeon ? +user.id : -2;

        // const id = auth.isSurgeon ? +response.data.surgeon.id : -2;

        // Update context with returned user
        auth.login(user.username, id);
        // Show success alert
        showAlert(response.data.message, "success");

        // Navigate to home only if the login is successful
        navigate("/home");
      } catch (error) {
        if (error instanceof AxiosError) {
          showAlert(error.response?.data.message || "Login failed", "error");
        } else {
          showAlert("An unexpected error occurred", "error");
        }
        console.error(error);
      }
    } else {
      showAlert("Please provide valid inputs.", "error");
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div
      className={`w-screen h-screen flex flex-col items-center justify-center overflow-hidden max-lg:text-gray-900 max-lg:dark:text-gray-900 ${
        auth.isSurgeon
          ? "bg-neutral max-lg:dark:bg-neutral"
          : "bg-secondary max-lg:dark:bg-secondary"
      }`}
    >
      {alert.message && <Alert />}

      <article className="prose prose-xl text-center py-10 max-lg:text-gray-900 max-lg:dark:text-gray-900 max-lg:prose-h1:text-gray-900 max-lg:dark:prose-h1:text-gray-900">
        <h1 className="my-2">PRECEDE-PtDA</h1>
        <h1>{auth.isSurgeon ? "Surgeon" : "Researcher"} Login</h1>
      </article>

      <form
        onSubmit={handleSubmitEvent}
        className="w-full px-2 max-w-sm max-lg:text-gray-900 max-lg:dark:text-gray-900"
      >
        <TextInput label="Username" name="username" onChange={handleInput} />

        <TextInput
          label="Password"
          name="password"
          onChange={handleInput}
          password
        />

        <button
          type="submit"
          className={`w-full my-5 py-2 btn text-lg text-white ${
            auth.isSurgeon ? "btn-primary" : "btn-accent"
          }`}
        >
          Log In
        </button>
      </form>

      <Link
        className="font-bold underline max-lg:text-gray-900 max-lg:dark:text-gray-900"
        to="/signup"
      >
        Don't have an account? Sign up
      </Link>

      <div className="max-w-md">
        <button
          className={`text-white text-[16px] p-4 mt-5 ${
            auth.isSurgeon ? "btn-accent" : "btn-primary"
          }`}
          onClick={() => auth.toggleIsSurgeon()}
        >
          {auth.isSurgeon ? "Researcher" : "Surgeon"} Login
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
