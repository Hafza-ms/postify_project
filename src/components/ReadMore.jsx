import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import Blog from './Data/Blog.jsx';
import "./ReadMore.css";

function ReadMore() {
  const { id } = useParams();
  const navigate = useNavigate();
  const blog = Blog.find((b) => b.id === parseInt(id));

  const storedUser = localStorage.getItem("currentUser");
  const currentUser = storedUser?.displayName || storedUser?.email || "Anonymous";
  const isAdmin = currentUser === "admin";

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");

  useEffect(() => {
    const storedComments = JSON.parse(localStorage.getItem(`comments-${id}`)) || [];
    setComments(storedComments);
  }, [id]);

  const saveComments = (updatedComments) => {
    setComments(updatedComments);
    localStorage.setItem(`comments-${id}`, JSON.stringify(updatedComments));
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    const newEntry = {
      id: Date.now(),
      text: newComment,
      user: currentUser,
      createdAt: new Date().toISOString(),
      edited: false
    };

    const updated = [...comments, newEntry];
    saveComments(updated);
    setNewComment("");
  };

  const handleDelete = (commentId) => {
    const updated = comments.filter(c => c.id !== commentId);
    saveComments(updated);
  };

  const handleEdit = (commentId, newText) => {
    const updated = comments.map(c =>
      c.id === commentId ? { ...c, text: newText, edited: true } : c
    );
    saveComments(updated);
  };

  if (!blog) return <div className="container py-4">Blog not found.</div>;

  return (
    <div className="container py-4">
      <button className="btn btn-outline-secondary mb-3" onClick={() => navigate("/")}>
        ← Back to Home
      </button>

      <h1 className="mb-2">{blog.title}</h1>
      <p className="text-muted">
        By <strong>{blog.author}</strong> | {blog.date}
      </p>
      <img src={blog.image} alt={blog.title} className="img-fluid rounded mb-4" />

      <div className="blog-content" style={{ whiteSpace: "pre-line", fontSize: "1.1rem", lineHeight: "1.7" }}>
        {blog.content}
      </div>

      {/* Comment Section */}
      <div className="mt-5">
        <h4>Comments</h4>
        {comments.length === 0 && <p className="text-muted">No comments yet.</p>}

        <ul className="list-unstyled">
          {comments.map((c) => (
            <li key={c.id} className="mb-3 p-2 bg-light rounded">
              <div>
                <strong>{c.user}</strong> 
                <small className="text-muted"> ({new Date(c.createdAt).toLocaleString()})</small>
              </div>
              {editingId === c.id ? (
                <div className="d-flex">
                  <input
                    className="form-control me-2"
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                  />
                  <button className="btn btn-success btn-sm me-2" onClick={() => {
                    handleEdit(c.id, editingText);
                    setEditingId(null);
                  }}>Save</button>
                  <button className="btn btn-secondary btn-sm" onClick={() => setEditingId(null)}>Cancel</button>
                </div>
              ) : (
                <>
                  <p className="mb-1">{c.text} {c.edited && <em>(edited)</em>}</p>
                  {(currentUser === c.user || isAdmin) && (
                    <div className="d-flex gap-2">
                      <button className="btn btn-outline-primary btn-sm" onClick={() => {
                        setEditingId(c.id);
                        setEditingText(c.text);
                      }}>Edit</button>
                      <button className="btn btn-outline-danger btn-sm" onClick={() => handleDelete(c.id)}>Delete</button>
                    </div>
                  )}
                </>
              )}
            </li>
          ))}
        </ul>

        {/* Add Comment Input */}
        <div className="d-flex mt-3">
          <input
            type="text"
            className="form-control me-2"
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button className="btn btn-primary" onClick={handleAddComment}>Post</button>
        </div>
      </div>
    </div>
  );
}

export default ReadMore;
