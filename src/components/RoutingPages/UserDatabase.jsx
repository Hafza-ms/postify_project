import React, { useEffect, useState } from "react";
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db, auth } from "./Firebase";
import { Button, Table, Container, Form, Alert, InputGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function UserDatabase() {
  const navigate = useNavigate();

  const [admin, setAdmin] = useState(null);
  const [users, setUsers] = useState([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setAdmin(currentUser);
      setLoading(false);
      if (currentUser?.email === "postify.app.og@gmail.com") {
        fetchUsers();
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchUsers = async () => {
    const snapshot = await getDocs(collection(db, "users"));
    setUsers(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "users", id));
    fetchUsers();
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setError("");
      const result = await signInWithEmailAndPassword(auth, email, password);
      if (result.user.email !== "postify.app.og@gmail.com") {
        await signOut(auth);
        setError("Access Denied: Unauthorized User");
      } else {
        navigate("/user-database");
      }
    } catch (err) {
      setError("Login failed. Invalid credentials.");
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setAdmin(null);
    setUsers([]);
  };

  if (loading) return <Container><p>Loading...</p></Container>;

  if (!admin || admin.email !== "postify.app.og@gmail.com") {
    return (
      <Container className="mt-5" style={{ maxWidth: "400px" }}>
        <h3 className="mb-3">Admin Login</h3>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleLogin}>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter admin email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <InputGroup>
              <Form.Control
                type={showPassword ? "text" : "password"}
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Button
                variant="outline-secondary"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </Button>
            </InputGroup>
          </Form.Group>

          <Button type="submit" variant="primary" className="w-100">
            Login
          </Button>
        </Form>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Registered Users</h2>
        <Button variant="outline-danger" onClick={handleLogout}>
          Logout
        </Button>
      </div>

      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Profile Pic</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.username}</td>
                <td>{u.email}</td>
                <td>
                  {u.profilePicUrl ? (
                    <img
                      src={u.profilePicUrl}
                      alt="avatar"
                      width="50"
                      height="50"
                      style={{ borderRadius: "50%", objectFit: "cover" }}
                    />
                  ) : (
                    <span>No Image</span>
                  )}
                </td>
                <td>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(u.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
}

export default UserDatabase;
