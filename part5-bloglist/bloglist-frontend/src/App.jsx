import { useState, useEffect } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";
import LoginForm from "./components/LoginForm";
import BlogForm from "./components/BlogForm";
import Notification from "./components/Notification";
import Toggable from "./components/Toggable";
import { useDispatch } from "react-redux";
import { setErrorNotification, setSuccessNotification } from "./reducers/notificationReducer";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const dispatch = useDispatch()

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  useEffect(() => {
    const loggedinUserJSON = window.localStorage.getItem("loggedinUser");

    if (loggedinUserJSON) {
      const user = JSON.parse(loggedinUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({ username, password });
      window.localStorage.setItem("loggedinUser", JSON.stringify(user));
      setUser(user);
      blogService.setToken(user.token);

      const blogList = blogs.sort((a, b) => b.likes - a.likes);
      const filtered = blogList.filter(
        (blog) => blog.user.username === username
      );
      setBlogs(filtered);
      setUsername("");
      setPassword("");
      dispatch(setSuccessNotification({
        text: `Welcome ${user.name}`,
        error: false
    }))
    } catch (error) {
      dispatch(setErrorNotification({
        text: `Wrong credentials`,
        error: true
    }))
    }
  };

  const handleLogout = async () => {
    window.localStorage.clear();
    setUser(null);
    dispatch(setSuccessNotification({
      text: "User logged out.",
      error: false
  }))
  };

  const createBlog = async (blogObject) => {
    try {
      const newBlog = await blogService.create(blogObject);
      setBlogs(blogs.concat(newBlog));
      dispatch(setSuccessNotification({
        text: `A new blog titled ${newBlog.title} by ${newBlog.authot} added.`,
        error: false
    }))
    } catch (error) {
      messageHandler("Posting new blog failed", "error");
      dispatch(setErrorNotification({
        text: "Posting new blog failed",
        error: true
    }))
    }
  };

  const updateBlog = async (blog) => {
    try {
      await blogService.update(blog.id, blog);
      const blogs = await blogService.getAll();
      setBlogs(blogs.sort((a, b) => b.likes - a.likes));
      dispatch(setSuccessNotification({
        text: `${blog.title} liked.`,
        error: false
    }))
    } catch (error) {
      dispatch(setErrorNotification({
        text: `Liking ${blog.title} failed.`,
        error: true
    }))
    }
  };

  const deleteBlog = async (id, blog) => {
    try {
      if (window.confirm(`Remove blog: "${blog.title}"?`)) {
        await blogService.deleteBlog(id);
        const response = await blogService.getAll();
        setBlogs(response);
        dispatch(setSuccessNotification({
          text: `${blog.title} has been removed.`,
          error: false
      }))
      }
    } catch (error) {
      console.log(error);
      dispatch(setErrorNotification({
        text: `Deleting ${blog.title} failed.`,
        error: true
    }))
    }
  };

  if (user === null) {
    return (
      <div>
        <Notification/>
        <h2>Log in to application</h2>
        <LoginForm
          username={username}
          password={password}
          handleLogin={handleLogin}
          onChangeUsername={({ target }) => setUsername(target.value)}
          onChangePassword={({ target }) => setPassword(target.value)}
        />
      </div>
    );
  }

  return (
    <div>
      <Notification/>
      <h2>Blogs</h2>
      <div>
        <p>{`${user.name} logged in `}</p>
        <button onClick={handleLogout}>Logout</button>
        <div>
          {blogs.map((blog) => (
            <Blog
              key={blog.id}
              blog={blog}
              updateBlog={updateBlog}
              deleteBlog={deleteBlog}
              username={user.username}
            />
          ))}
        </div>
        <Toggable buttonLabel="Create new blog">
          <BlogForm createBlog={createBlog} />
        </Toggable>
      </div>
    </div>
  );
};

export default App;
