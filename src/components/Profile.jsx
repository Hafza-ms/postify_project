import React, { useState, useRef, useEffect } from "react";
import defaultProfilePhoto from "../assets/photo.jpg";
import './Profile.css'

const Profile = () => {
  const [activeTab, setActiveTab] = useState("posts");
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [postPhotos, setPostPhotos] = useState([]);
  const [caption, setCaption] = useState("");
  const [posts, setPosts] = useState(() => {
    const savedPosts = localStorage.getItem("postify-posts");
    return savedPosts ? JSON.parse(savedPosts) : [];
  });
  const [newComments, setNewComments] = useState({});
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [username, setUsername] = useState("postify_user");
  const [bio, setBio] = useState("Welcome to my world! ✨ Sharing moments, one post at a time.");
  const [profilePhoto, setProfilePhoto] = useState(defaultProfilePhoto);

  const fileInputRef = useRef(null);
  const profilePhotoInputRef = useRef(null);
  const [menuOpenFor, setMenuOpenFor] = useState(null);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpenFor(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    localStorage.setItem("postify-posts", JSON.stringify(posts));
  }, [posts]);

  const handleAddPhotoClick = () => fileInputRef.current.click();

  const handlePostPhotosChange = (e) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files).map((file) =>
        URL.createObjectURL(file)
      );
      setPostPhotos(filesArray);
    }
  };

  const handlePostSubmit = (e) => {
  e.preventDefault();
  if (postPhotos.length === 0) return;

  setIsUploading(true);

  setTimeout(() => {
    const currentUser = localStorage.getItem("currentUser") || "Anonymous";

    const newPost = {
      id: Date.now(),
      photos: postPhotos,
      caption: caption.trim(),
      author: currentUser,
      date: new Date().toISOString(),

      // Optional metadata
      liked: false,
      likesCount: 0,
      saved: false,
      savesCount: 0,
      comments: [],
      commentsCount: 0,
    };

    setPosts((prevPosts) => [...prevPosts, newPost]);
    setPostPhotos([]);
    setCaption("");
    setIsCreatingPost(false);
    setIsUploading(false);
  }, 1500);
};

  const handleCancelPost = () => {
    setPostPhotos([]);
    setCaption("");
    setIsCreatingPost(false);
  };

  const toggleLike = (id) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === id
          ? {
              ...post,
              liked: !post.liked,
              likesCount: post.liked
                ? post.likesCount - 1
                : post.likesCount + 1,
            }
          : post
      )
    );
  };

  const toggleSave = (id) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === id
          ? {
              ...post,
              saved: !post.saved,
              savesCount: post.saved
                ? post.savesCount - 1
                : post.savesCount + 1,
            }
          : post
      )
    );
  };

  const deletePost = (id) => {
    setPosts((prev) => prev.filter((post) => post.id !== id));
    setMenuOpenFor(null);
  };

  const changeCaption = (id) => {
    const post = posts.find((p) => p.id === id);
    const newCaption = prompt("Update caption:", post.caption);
    if (newCaption !== null) {
      setPosts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, caption: newCaption } : p))
      );
    }
    setMenuOpenFor(null);
  };

  const saveProfileEdits = () => {
    setIsEditingProfile(false);
  };

  const handleProfilePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfilePhoto(imageUrl);
    }
  };
 


  return (
  
      <div style={styles.container}>
        {/* Profile Header */}
        <div style={styles.header}>
          <label htmlFor="profile-photo" style={{ cursor: "pointer" }}>
            <img
              src={profilePhoto}
              alt="Profile"
              style={{
                ...styles.avatar,
                objectFit: "cover",
              }}
            />
            <input
              id="profile-photo"
              type="file"
              accept="image/*"
              onChange={handleProfilePhotoChange}
              ref={profilePhotoInputRef}
              style={{ display: "none" }}
            />
          </label>

          <div style={styles.profileInfo}>
            <h2 style={{ margin: 0 }}>{username}</h2>
            <button
              style={styles.editBtn}
              onClick={() => setIsEditingProfile(true)}
            >
              Edit Profile
            </button>
            <p style={styles.bio}>{bio}</p>
            <b style={{ fontSize: 14 }}>
              {posts.length} posts | 0 followers | 0 following
            </b>
          </div>
        </div>

        {/* Tabs */}
        <div style={styles.tabs}>
          <button onClick={() => setActiveTab("posts")} style={styles.tabButton}>
            Posts
          </button>
        </div>

        {/* Posts Content */}
        <div style={styles.postsSection}>
          {!isCreatingPost && (
            <div style={{ textAlign: "center", color: "#555" }}>
              <strong>share anything with your friend</strong>
              <br />
              <button
                onClick={() => setIsCreatingPost(true)}
                style={styles.primaryButton}
              >
                {posts.length > 0 ? "Add another post" : "Create your first post"}
              </button>
            </div>
          )}

          {isCreatingPost && (
            <form onSubmit={handlePostSubmit}>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handlePostPhotosChange}
                ref={fileInputRef}
                style={{ display: "none" }}
              />
              <button
                type="button"
                onClick={handleAddPhotoClick}
                style={styles.primaryButton}
              >
                Add Photo
              </button>

              {postPhotos.length > 0 && (
                <div style={styles.previewContainer}>
                  {postPhotos.map((photo, i) => (
                    <img
                      key={i}
                      src={photo}
                      alt={`upload-${i}`}
                      style={styles.previewImage}
                    />
                  ))}
                </div>
              )}

              <label style={{ display: "block", fontWeight: "bold" }}>
                Caption:
                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Write a caption..."
                  rows={3}
                  style={styles.textarea}
                />
              </label>

              <div style={styles.buttonRow}>
                <button
                  type="submit"
                  disabled={postPhotos.length === 0 || isUploading}
                  style={{
                    ...styles.primaryButton,
                    flex: 1,
                    cursor: isUploading ? "not-allowed" : "pointer",
                  }}
                >
                  {isUploading ? "Uploading..." : "Post"}
                </button>
                <button
                  type="button"
                  onClick={handleCancelPost}
                  disabled={isUploading}
                  style={{
                    ...styles.cancelButton,
                    flex: 1,
                    cursor: isUploading ? "not-allowed" : "pointer",
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          <div style={{ marginTop: 30 }}>
            {posts.length === 0 ? (
              <p>No posts yet.</p>
            ) : (
              posts.map((post) => (
                <div key={post.id} style={styles.postCard}>
                  <div style={styles.postImages}>
                    {post.photos.map((photo, idx) => (
                      <img
                        key={idx}
                        src={photo}
                        alt={`Post photo ${idx + 1}`}
                        style={styles.postImage}
                      />
                    ))}
                  </div>

                  <p style={{ whiteSpace: "pre-wrap", marginBottom: 12 }}>
                    {post.caption || <i>No caption</i>}
                  </p>

                  <div style={styles.postActions}>
                    <div style={{ display: "flex", gap: 10 }}>
                      <button onClick={() => toggleLike(post.id)} style={styles.actionButton}>
                        {post.liked ? "❤️" : "🤍"} {post.likesCount}
                      </button>
                      <button style={styles.actionButton}>💬 {post.commentsCount}</button>
                      <button onClick={() => toggleSave(post.id)} style={styles.actionButton}>
                        {post.saved ? "🔖" : "📄"} {post.savesCount}
                      </button>
                    </div>

                    <div style={{ position: "relative" }} ref={menuRef}>
                      <button
                        onClick={() =>
                          setMenuOpenFor(menuOpenFor === post.id ? null : post.id)
                        }
                        style={{
                          fontSize: 22,
                          border: "none",
                          background: "transparent",
                        }}
                      >
                        ⋯
                      </button>
                      {menuOpenFor === post.id && (
                        <div style={styles.dropdownMenu}>
                          <button
                            onClick={() => changeCaption(post.id)}
                            style={styles.dropdownItem}
                          >
                            Change Caption
                          </button>
                          <button
                            onClick={() => deletePost(post.id)}
                            style={{ ...styles.dropdownItem, color: "red" }}
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <details style={{ marginTop: 10 }}>
                    <summary style={{ cursor: "pointer", fontWeight: "bold" }}>
                      💬 Comments ({post.commentsCount})
                    </summary>
                    <div style={{ marginTop: 10 }}>
                      {post.comments.length === 0 ? (
                        <p style={{ fontStyle: "italic", color: "#666" }}>No comments yet.</p>
                      ) : (
                        <ul style={{ paddingLeft: 16 }}>
                          {post.comments.map((c, i) => (
                            <li key={i} style={styles.comment}>{c}</li>
                          ))}
                        </ul>
                      )}
                      <input
                        type="text"
                        placeholder="Write a comment..."
                        value={newComments[post.id] || ""}
                        onChange={(e) =>
                          setNewComments((prev) => ({
                            ...prev,
                            [post.id]: e.target.value,
                          }))
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && newComments[post.id]?.trim()) {
                            const comment = newComments[post.id].trim();
                            setPosts((prev) =>
                              prev.map((p) =>
                                p.id === post.id
                                  ? {
                                      ...p,
                                      comments: [...p.comments, comment],
                                      commentsCount: p.commentsCount + 1,
                                    }
                                  : p
                              )
                            );
                            setNewComments((prev) => ({
                              ...prev,
                              [post.id]: "",
                            }));
                          }
                        }}
                        style={styles.commentInput}
                      />
                    </div>
                  </details>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Edit Profile Modal */}
        {isEditingProfile && (
          <div style={styles.modalOverlay}>
            <div style={styles.modal}>
              <h3>Edit Profile</h3>
              <label>
                Username:
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  style={styles.input}
                />
              </label>
              <label>
                Bio:
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                  style={styles.textarea}
                />
              </label>
              <div style={styles.buttonRow}>
                <button onClick={saveProfileEdits} style={styles.primaryButton}>
                  Save
                </button>
                <button onClick={() => setIsEditingProfile(false)} style={styles.cancelButton}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
    </div>
  );
};

const styles = {
  page: {
    width: "100%",
    minHeight: "100vh",
    backgroundColor: "#f5f5f5",
    padding: "20px 0",
  },
  container: {
    width: "95%",
    maxWidth: "1000px",
    margin: "0 auto",
    padding: 20,
    background: "#fff",
    borderRadius: 12,
    boxShadow: "0 0 10px #ccc",
    fontFamily: "Arial, sans-serif",
  },
  header: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
    textAlign: "center",
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: "50%",
    background: "#ccc",
    flexShrink: 0,
  },
  profileInfo: {
    minWidth: 200,
    flex: 1,
  },
  editBtn: {
    padding: "6px 14px",
    borderRadius: 6,
    border: "1px solid black",
    background: "white",
    cursor: "pointer",
    marginTop: 8,
    width: "100%",
    maxWidth: 180,
  },
  bio: {
    marginTop: 10,
    fontSize: 14,
  },
  tabs: {
    marginTop: 30,
    display: "flex",
    justifyContent: "center",
  },
  tabButton: {
    padding: "6px 12px",
    borderRadius: 6,
    border: "2px solid black",
    background: "#f0f0f0",
    cursor: "pointer",
  },
  postsSection: {
    marginTop: 20,
    padding: 12,
    border: "1px solid #ccc",
    borderRadius: 8,
    fontSize: 16,
    whiteSpace: "pre-wrap",
    overflowY: "auto",
  },
  primaryButton: {
    backgroundColor: "black",
    color: "white",
    padding: "8px 16px",
    borderRadius: 6,
    border: "none",
    marginTop: 10,
  },
  cancelButton: {
    padding: "8px 16px",
    borderRadius: 6,
    border: "1px solid #ccc",
    background: "white",
  },
  previewContainer: {
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
    marginBottom: 10,
  },
  previewImage: {
    width: 80,
    height: 80,
    objectFit: "cover",
    borderRadius: 6,
  },
  textarea: {
    width: "100%",
    padding: 8,
    borderRadius: 6,
    border: "1px solid #ccc",
    marginTop: 4,
  },
  buttonRow: {
    marginTop: 20,
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
  },
  postCard: {
    width: "100%",
    borderRadius: 8,
    border: "1px solid #ddd",
    padding: 12,
    marginBottom: 20,
    backgroundColor: "#fafafa",
  },
  postImages: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    maxHeight: 300,
    overflowY: "auto",
    marginBottom: 12,
  },
  postImage: {
    width: "100%",
    maxHeight: 280,
    objectFit: "cover",
    borderRadius: 8,
  },
  postActions: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 12,
  },
  actionButton: {
    border: "none",
    background: "transparent",
    cursor: "pointer",
    fontSize: 16,
  },
  dropdownMenu: {
    position: "absolute",
    top: "110%",
    right: 0,
    background: "white",
    border: "1px solid #ccc",
    borderRadius: 6,
    boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
    zIndex: 10,
    minWidth: 140,
  },
  dropdownItem: {
    padding: 10,
    border: "none",
    background: "white",
    width: "100%",
    textAlign: "left",
  },
  comment: {
    background: "#f1f1f1",
    padding: "6px 10px",
    borderRadius: 6,
    marginBottom: 6,
  },
  commentInput: {
    width: "100%",
    marginTop: 6,
    padding: "8px",
    borderRadius: 6,
    border: "1px solid #ccc",
    fontSize: 14,
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0,0,0,0.4)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
  },
  modal: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 12,
    maxWidth: 400,
    width: "90%",
  },
  input: {
    width: "100%",
    padding: 8,
    borderRadius: 6,
    border: "1px solid #ccc",
    marginTop: 4,
    marginBottom: 12,
  },
  
};

export default Profile;
