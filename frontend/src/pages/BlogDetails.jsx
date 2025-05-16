import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';

const BlogDetails = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBlog = async () => {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No token found. Please login.');
          setLoading(false);
          return;
        }

        const res = await axios.get(`http://localhost:5000/blogs/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setBlog(res.data);
      } catch (err) {
        if (err.response && err.response.status === 404) {
          setError('Blog not found.');
        } else if (err.response && err.response.status === 401) {
          setError('Unauthorized. Please login again.');
        } else {
          setError('Failed to fetch blog details.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  if (loading) return <p>Loading blog details...</p>;

  if (error)
    return (
      <div className="alert alert-danger" role="alert">
        {error}{' '}
        <button
          onClick={() => window.location.reload()}
          className="btn btn-sm btn-outline-light"
        >
          Retry
        </button>
      </div>
    );

  if (!blog) return <p>No blog found.</p>;

  return (
    <div className="col-md-8 offset-md-2">
      <h2>{blog.title}</h2>
      <p><strong>Category:</strong> {blog.category}</p>
      {blog.image && (
        <img
          src={blog.image}
          alt={blog.title}
          style={{ maxWidth: '100%', height: 'auto', borderRadius: 6, marginBottom: 20 }}
          onError={(e) => (e.target.style.display = 'none')}
        />
      )}
      <p>{blog.content}</p>

      <Link to="/" className="btn btn-secondary mt-3">
        Back to Blogs
      </Link>
    </div>
  );
};

export default BlogDetails;
