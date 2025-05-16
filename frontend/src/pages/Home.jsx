import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Home = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');

      if (!token) {
        setError('No token found. Please login.');
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get('http://localhost:5000/blogs', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setBlogs(res.data);
      } catch (err) {
        if (err.response && err.response.status === 401) {
          setError('Unauthorized. Please log in again.');
        } else {
          setError('Failed to load blogs.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div className="container mt-4">
      <h2 className="mb-4">All Blogs</h2>
      {blogs.length === 0 && <p>No blogs found.</p>}

      <div className="row">
        {blogs.map((blog) => (
          <div className="col-md-6 mb-4" key={blog._id}>
            <div className="card h-100">
              {blog.image && (
                <img src={blog.image} alt={blog.title} className="card-img-top" />
              )}
              <div className="card-body">
                <h5 className="card-title">
                  <Link to={`/blog/${blog._id}`} className="text-decoration-none">
                    {blog.title}
                  </Link>
                </h5>
                <p className="card-text">
                  {blog.content.length > 100
                    ? blog.content.substring(0, 100) + '...'
                    : blog.content}
                </p>
                <p className="card-text"><small>Author: {blog.author}</small></p>
                <p className="card-text"><small>Category: {blog.category}</small></p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
