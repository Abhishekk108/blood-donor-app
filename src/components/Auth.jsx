import { useState } from "react";
import { auth } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

export default function Auth({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signup = async () => {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      setUser(res.user);
      alert("Signup successful");
    } catch (err) {
      alert(err.message);
    }
  };

  const login = async () => {
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      setUser(res.user);
      alert("Login successful");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div style={{ padding: 30 }}>
      <h2>Blood <i className="bi bi-droplet-fill" style={{ color: "red", fontSize: "24px" }}></i> Donor  Finder </h2>
   

      <input
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <br /><br />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <br /><br />

      <button className="btn btn-success" onClick={signup}>Signup</button>
      <button className="btn btn-success" onClick={login} style={{ marginLeft: 10 }}>
        Login
      </button>
    </div>
  );
}
