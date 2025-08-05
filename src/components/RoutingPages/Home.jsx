import React, { useEffect, useState } from 'react'
import './Home.css'
import Blog from "../Data/Blog";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./Firebase"; 
import BlogCard from '../BlogCard';


function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [allBlogs, setAllBlogs] = useState([]);

    useEffect(() => {
    const fetchBlogs = async () => {
      // 🔵 1. Load localStorage posts
      const profilePosts = JSON.parse(localStorage.getItem("postify-posts")) || [];

      const formattedLocalPosts = profilePosts.map((post) => ({
        id: post.id,
        title: post.caption || "Untitled Post",
        author: post.author || localStorage.getItem("currentUser") || "Anonymous",
        excerpt: post.caption?.slice(0, 100) || "",
        content: post.caption || "",
        image: post.photos?.[0] || null,
        date: new Date(post.id).toLocaleDateString(),
      }));

      // 🔴 2. Load Firebase posts
      const firebasePosts = [];
      try {
        const querySnapshot = await getDocs(collection(db, "posts"));
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          firebasePosts.push({
            id: doc.id,
            title: data.title || "Untitled Post",
            author: data.author || "FirebaseUser",
            excerpt: data.content?.slice(0, 100) || "",
            content: data.content || "",
            image: data.image || null,
            date: data.date
              ? new Date(data.date.seconds * 1000).toLocaleDateString()
              : "Unknown",
          });
        });
      } catch (error) {
        console.error("Error fetching Firebase blogs:", error);
      }

      // 🟢 3. Merge all: Firebase + LocalStorage + Static
      const combined = [...firebasePosts, ...formattedLocalPosts, ...Blog];
      setAllBlogs(combined);
    };

   fetchBlogs();
  },[]);

  const filteredBlogs = allBlogs.filter((post) =>
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
