


import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const CreateBlog = () => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { id } = useParams(); // used to determine edit mode

  const token = localStorage.getItem('token');

  // Fetch existing blog data if editing
  useEffect(() => {
    if (id) {
      axios
        .get(`http://localhost:5000/blogs/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => {
          const { title, category, content, image } = res.data;
          setTitle(title);
          setCategory(category);
          setContent(content);
          setImage(image);
        })
        .catch(err => {
          setError('Failed to fetch blog for editing');
        });
    }
  }, [id, token]);

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');

    if (!token) {
      setError('Please login first');
      return;
    }

    try {
      if (id) {
        // 🔁 UPDATE mode
        await axios.put(
          `http://localhost:5000/blogs/${id}`,
          { title, category, content, image },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        // 🆕 CREATE mode
        await axios.post(
          'http://localhost:5000/blogs',
          { title, category, content, image },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit blog');
    }
  };

  return (
    <div className="col-md-8 offset-md-2">
      <h2>{id ? 'Edit Blog' : 'Create Blog'}</h2>
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Title</label>
          <input
            type="text"
            className="form-control"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
            placeholder="Enter blog title"
          />
        </div>

        <div className="mb-3">
          <label>Category</label>
          <input
            type="text"
            className="form-control"
            value={category}
            onChange={e => setCategory(e.target.value)}
            required
            placeholder="Enter blog category"
          />
        </div>

        <div className="mb-3">
          <label>Content</label>
          <textarea
            className="form-control"
            rows="6"
            value={content}
            onChange={e => setContent(e.target.value)}
            required
            placeholder="Write your blog content here"
          ></textarea>
        </div>

        <div className="mb-3">
          <label>Image URL</label>
          <input
            type="url"
            className="form-control"
            value={image}
            onChange={e => setImage(e.target.value)}
            placeholder="Paste image URL"
          />
        </div>

        {image && (
          <div className="mb-3">
            <label>Image Preview:</label>
            <img
              src={image}
              alt="Blog preview"
              style={{ maxWidth: '100%', height: 'auto', borderRadius: 6 }}
              onError={e => {
                e.target.src = '';
              }}
            />
          </div>
        )}

        <button type="submit" className="btn btn-primary">
          {id ? 'Update Blog' : 'Create Blog'}
        </button>
      </form>
    </div>
  );
};

export default CreateBlog;

