import React, { useEffect, useState } from 'react'
import './Home.css'
import Blog from "../Data/Blog";
import { Link } from 'react-router-dom';
import BlogCard from '../BlogCard';


function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [allBlogs, setAllBlogs] = useState([]);

   useEffect(() => {
    // Load user-created posts from localStorage
    const profilePosts = JSON.parse(localStorage.getItem("postify-posts")) || [];
    
     // Format them to match BlogCard structure
    const formattedProfilePosts = profilePosts.map((post) => ({
      id: post.id,
      title: post.caption || "Untitled Post",
      author: post.author || localStorage.getItem("currentUser") || "Anonymous",
      excerpt: post.caption?.slice(0, 100) || "",
      content: post.caption || "",
      image: post.photos?.[0] || null,
      date: new Date(post.id).toLocaleDateString(),
    }));

    // Merge user-created + static blog list
    const combined = [...formattedProfilePosts, ...Blog];
    setAllBlogs(combined);
  }, [])

  const filteredBlogs = Blog.filter((post) =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
  );
    
  return (

    
    
      <div className="container py-4">
      {/* Tagline section */}
      <div className="hero-background">
        <h1 className="tagline-title">Postify</h1>
        <p className="tagline-text" >
          Where your thoughts <span className="tagline-highlight">find their voice.</span>
        </p>
      </div>

      {/*  Search Bar */}
      <div className="mb-4 d-flex justify-content-center">
        <input
          type="text"
          className="form-control w-75 shadow-sm"
          placeholder="Search blogs by title, author, or keywords..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ borderRadius: "20px", padding: "0.6rem 1rem" }}
        />
      </div>


      {/* Blogs list goes here */}
      <div className="row">
       {filteredBlogs.length > 0 ? (
          filteredBlogs.map((post) => (
          <div key={post.id} className="col-sm-12 col-md-6 col-lg-4 d-flex">
            <BlogCard blog={post}/>
            
           
              
              
          
          </div>
        ))
    ) :(
       <div className="text-center text-muted">No blogs found.</div> 
    )}

      </div>
    </div>
  )
}

export default Home
