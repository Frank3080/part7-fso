import { useState } from "react";
import { updateBlog as updateBlogAction, deleteBlog as deleteBlogAction } from "../reducers/blogReducer"
import { useDispatch } from "react-redux";

const Blog = ({ blog, username }) => {
  const [visible, setVisible] = useState(false);
  const [userLikes, setUserLikes] = useState(blog.likes);
  const dispatch = useDispatch()

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  const updatedBlog = {
    title: blog.title,
    author: blog.author,
    url: blog.url,
    user: blog.user,
    id: blog.id,
    likes: userLikes + 1,
  };

  const addLike = () => {
    setUserLikes(userLikes + 1);
    dispatch(updateBlogAction(updatedBlog))
  };

  const handleClick = () => {
    setVisible((prevVisible) => !prevVisible);
  };

  const handleDelete = () => {
    dispatch(deleteBlogAction(blog.id))
  }

  return (
    <div>
      <div style={blogStyle}>
        {blog.title} : {blog.author}
      </div>
      <button onClick={handleClick}>{visible ? "hide" : "view"}</button>
      {visible && (
        <div>
          <a href={blog.url.includes("//") ? blog.url : `//${blog.url}`}>
            {blog.url}
          </a>
          <div>
            likes {blog.likes}
            <button onClick={addLike}>Like</button>
          </div>
          <div>{blog.username}</div>
          <button onClick={handleDelete}>Remove</button>
        </div>
      )}
    </div>
  );
};

export default Blog;
