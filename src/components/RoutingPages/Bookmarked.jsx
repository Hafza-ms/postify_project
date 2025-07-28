import React, { useEffect, useState } from "react";
import Blog from "../Data/Blog";
import BlogCard from "../components/BlogCard";

function Bookmarked() {
  const [bookmarkedBlogs, setBookmarkedBlogs] = useState([]);

  useEffect(() => {
    const bookmarkedIds = JSON.parse(localStorage.getItem("bookmarkedPosts")) || [];
    const filtered = Blog.filter((b) => bookmarkedIds.includes(b.id));
    setBookmarkedBlogs(filtered);
  }, []);

  return (
    <div className="container py-4">
      <h2 className="mb-4">Bookmarked Posts</h2>
      <div className="row">
        {bookmarkedBlogs.length > 0 ? (
          bookmarkedBlogs.map((post) => (
            <div key={post.id} className="col-md-4 mb-4">
              <BlogCard blog={post} />
            </div>
          ))
        ) : (
          <div className="text-center text-muted">No bookmarked posts.</div>
        )}
      </div>
    </div>
  );
}

export default Bookmarked;
