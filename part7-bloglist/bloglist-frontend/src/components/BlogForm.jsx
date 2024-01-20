import React, { useState } from "react";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { createBlog } from "../reducers/blogReducer";

const BlogForm = () => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");
  const dispatch = useDispatch()

  const addBlog = async (e) => {
    e.preventDefault();
    dispatch(createBlog({
      title,
      author,
      url,
    }));
    setTitle("");
    setAuthor("");
    setUrl("");
  };

  return (
    <div>
      <h2>Create a new blog:</h2>
      <form onSubmit={addBlog}>
        <div>
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            placeholder="title"
            name="title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
        </div>
        <div>
          <label htmlFor="author">Author:</label>
          <input
            type="text"
            id="author"
            placeholder="author"
            name="author"
            value={author}
            onChange={(event) => setAuthor(event.target.value)}
          />
        </div>
        <div>
          <label htmlFor="url">URL:</label>
          <input
            type="text"
            id="url"
            name="url"
            placeholder="url"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
          />
        </div>
        <button id="create-btn" type="submit">
          Create new blog
        </button>
      </form>
    </div>
  );
};

export default BlogForm;
