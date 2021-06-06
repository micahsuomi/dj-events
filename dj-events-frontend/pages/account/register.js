import { useState, useEffect, useContext } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaUser } from "react-icons/fa";
import Link from "next/link";

import AuthContext from "@/context/AuthContext";
import Layout from "@/components/Layout";

import styles from "@/styles/AuthForm.module.css";

export default function RegisterPage() {
  // course way
  //   const [userName, setUserName] = useState("");
  //   const [email, setEmail] = useState("");
  //   const [password, setPassword] = useState("");
  //   const [passwordConfirm, setPasswordConfirm] = useState("");

  // preferred way
  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });
  const { register, error } = useContext(AuthContext);
  const { username, email, password, passwordConfirm } = newUser;
  useEffect(() => error && toast.error(error));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== passwordConfirm) {
      toast.error("Passwords do not match");
    } else {
      register({ username, email, password });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewUser({
      ...newUser,
      [name]: value,
    });
  };

  return (
    <Layout title="User Registration">
      <div className={styles.auth}>
        <h1>
          <FaUser /> Register
        </h1>
        <ToastContainer />
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              name="username"
              placeholder="username"
              onChange={handleChange}
              required
              //   onChange={(e) => setUserName(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              name="email"
              placeholder="email"
              onChange={handleChange}
              required
              //   onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              name="password"
              placeholder="password"
              onChange={handleChange}
              required
              //   onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="password">Password Confirm</label>
            <input
              type="password"
              id="passwordConfirm"
              value={passwordConfirm}
              name="passwordConfirm"
              placeholder="confirm password"
              onChange={handleChange}
              required
              //   onChange={(e) => setPasswordConfirm(e.target.value)}
            />
          </div>
          <input type="submit" value="Register" className="btn" />
        </form>
        <p>
          Have an account already?{" "}
          <Link href="/account/login">
            <a>Login</a>
          </Link>
        </p>
      </div>
    </Layout>
  );
}
