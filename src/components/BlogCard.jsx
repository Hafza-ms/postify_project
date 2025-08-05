import React, { useEffect, useState } from 'react';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaHeart, FaRegHeart, FaBookmark, FaRegBookmark, FaCommentDots } from 'react-icons/fa';

function BlogCard({ blog }) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [bookmarked, setBookmarked] = useState(false);
  const [commentCount, setCommentCount] = useState(0);

  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
   const currentUserEmail = currentUser?.email || 'guest';  // fallback key if user not logged
 
   useEffect(() => {
    const likedPosts = JSON.parse(localStorage.getItem(`likedPosts-${currentUserEmail}`)) || [];
    const bookmarkedPosts = JSON.parse(localStorage.getItem(`bookmarkedPosts-${currentUserEmail}`)) || [];

    setLiked(likedPosts.includes(blog.id));
    setBookmarked(bookmarkedPosts.includes(blog.id));

    // Load total like count for this blog
    const storedLikeCount = JSON.parse(localStorage.getItem(`likes-${blog.id}`)) || 0;
    setLikeCount(storedLikeCount);

    // Load comment count
    const storedComments = JSON.parse(localStorage.getItem(`comments-${blog.id}`)) || [];
    setCommentCount(storedComments.length);
  }, [blog.id, currentUser]);

  const handleLike = () => {
    const likedPostsKey = `likedPosts-${currentUser}`;
    const likedPosts = JSON.parse(localStorage.getItem(likedPostsKey)) || [];

    let updatedLikes;
    let updatedCount = likeCount;

    if (liked) {
      updatedLikes = likedPosts.filter((id) => id !== blog.id);
      updatedCount = Math.max(0, likeCount - 1);
    } else {
      updatedLikes = [...likedPosts, blog.id];
      updatedCount = likeCount + 1;
    }

    localStorage.setItem(likedPostsKey, JSON.stringify(updatedLikes));
    localStorage.setItem(`likes-${blog.id}`, JSON.stringify(updatedCount));

    setLiked(!liked);
    setLikeCount(updatedCount);
  };

  const handleBookmark = () => {
    const bookmarkedKey = `bookmarkedPosts-${currentUserEmail}`;
    const bookmarkedPosts = JSON.parse(localStorage.getItem(bookmarkedKey)) || [];
    
    const updatedBookmarks = bookmarked
      ? bookmarkedPosts.filter((id) => id !== blog.id)
      : [...bookmarkedPosts, blog.id];
    
    localStorage.setItem('bookmarkedPosts', JSON.stringify(updatedBookmarks));
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
