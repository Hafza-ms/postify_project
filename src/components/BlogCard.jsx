import React, { useEffect, useState } from 'react';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaHeart, FaRegHeart, FaBookmark, FaRegBookmark, FaCommentDots } from 'react-icons/fa';
import useLocalUser from './Data/UseLocalUser';

function BlogCard({ blog }) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [bookmarked, setBookmarked] = useState(false);
  const [commentCount, setCommentCount] = useState(0);

  const currentUser = useLocalUser();
  const currentUserEmail = currentUser?.email || 'guest';
 
   useEffect(() => {
    const likedKey = `likedPosts-${currentUserEmail}`;
    const bookmarkedKey = `bookmarkedPosts-${currentUserEmail}`;

    setLiked((JSON.parse(localStorage.getItem(likedKey)) || []).includes(blog.id));
    setBookmarked((JSON.parse(localStorage.getItem(bookmarkedKey)) || []).includes(blog.id))
    setLikeCount(JSON.parse(localStorage.getItem(`likes-${blog.id}`)) || 0);
    setCommentCount((JSON.parse(localStorage.getItem(`comments-${blog.id}`)) || []).length);
  }, [blog.id, currentUserEmail]);
  

  const handleLike = () => {
    const likedKey = `likedPosts-${currentUserEmail}`;
    let likedPosts = JSON.parse(localStorage.getItem(likedKey)) || [];
    let count = likeCount;

    if (liked) {
      likedPosts = likedPosts.filter(id => id !== blog.id);
      count = Math.max(0, count - 1);
    } else {
      likedPosts.push(blog.id);
      count += 1;
    }

    localStorage.setItem(likedKey, JSON.stringify(likedPosts));
    localStorage.setItem(`likes-${blog.id}`, JSON.stringify(count));

    setLiked(!liked);
    setLikeCount(count);
  };

  const handleBookmark = () => {
    const bookmarkKey = `bookmarkedPosts-${currentUserEmail}`;
    let bookmarks = JSON.parse(localStorage.getItem(bookmarkKey)) || [];
    
     if (bookmarked) {
      bookmarks = bookmarks.filter(id => id !== blog.id);
    } else {
      bookmarks.push(blog.id);
    }
    
   localStorage.setItem(bookmarkKey, JSON.stringify(bookmarks));
    setBookmarked(!bookmarked);
  };

  return (
    <div className='blog-card'>
      <Card className="mb-4 shadow-sm border-0 h-100">
        {blog.image && (
          <Card.Img
            variant="top"
            src={blog.image}
            alt={blog.title}
            style={{ height: '200px', objectFit: 'cover' }}
          />
        )}
        <Card.Body className='d-flex flex-column'>
          <Card.Title>{blog.title}</Card.Title>
          <Card.Subtitle className="mb-2 text-muted">
            By {blog.author} • {blog.date}
          </Card.Subtitle>
          <Card.Text className='flex-grow-1'>{blog.excerpt}</Card.Text>

          <div className="d-flex justify-content-between align-items-center mt-3">
            <Link to={`/readmore/${blog.id}`} className="btn btn-primary">
              Read More
            </Link>

            <div className="d-flex gap-3 align-items-center text-muted">
              <span
                onClick={handleLike}
                style={{ cursor: 'pointer' }}
                title="Like"
                className="d-flex align-items-center"
              >
                {liked ? <FaHeart color="red" /> : <FaRegHeart />}
                <span className="ms-1">{likeCount}</span>
              </span>

              <span
                onClick={handleBookmark}
                style={{ cursor: 'pointer' }}
                title="Bookmark"
              >
                {bookmarked ? <FaBookmark color="blue" /> : <FaRegBookmark />}
              </span>

              <span className="d-flex align-items-center" title="Comments">
                <FaCommentDots className="me-1" />
                {commentCount}
              </span>
            </div>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}

export default BlogCard;
