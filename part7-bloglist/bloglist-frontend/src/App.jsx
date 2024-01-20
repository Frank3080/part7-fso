import { useState, useEffect } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";
import LoginForm from "./components/LoginForm";
import BlogForm from "./components/BlogForm";
import Notification from "./components/Notification";
import Toggable from "./components/Toggable";
import { useDispatch, useSelector } from "react-redux";
import {
  setErrorNotification,
  setSuccessNotification,
} from "./reducers/notificationReducer";

const App = () => {
  const blogs = useSelector((state) => state.blogs);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    const initializeBlogs = async () => {
      try {
        const blogs = await blogService.getAll();
        dispatch({ type: "INIT_BLOGS", payload: blogs });
      } catch (error) {
        console.error("Error initializing blogs:", error);
      }
    };

    initializeBlogs();
  }, [dispatch]);

  useEffect(() => {
    const loggedinUserJSON = window.localStorage.getItem("loggedinUser");

    if (loggedinUserJSON) {
      const user = JSON.parse(loggedinUserJSON);
      dispatch({ type: "SET_USER", payload: user });
      blogService.setToken(user.token);
    }
  }, [dispatch]);

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({ username, password });

      console.log("Login successful. User:", user);

      window.localStorage.setItem("loggedinUser", JSON.stringify(user));
      blogService.setToken(user.token);

      const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes);
      const filtered = sortedBlogs.filter(
        (blog) => blog.user.username === username
      );

      dispatch({ type: "SET_USER", payload: user });
      dispatch({ type: "CREATE_BLOG", payload: filtered });

      setUsername("");
      setPassword("");
      dispatch(
        setSuccessNotification({
          text: `Welcome ${user.name}`,
          error: false,
        })
      );
    } catch (error) {
      console.error("Login failed. Error:", error);

      dispatch(
        setErrorNotification({
          text: `Wrong credentials`,
          error: true,
        })
      );
    }
  };

  const handleLogout = async () => {
    window.localStorage.clear();
    dispatch({ type: "REMOVE_USER" });

    dispatch(
      setSuccessNotification({
        text: "User logged out.",
        error: false,
      })
    );
  };

  const createBlog = async (blogObject) => {
    try {
      const newBlog = await blogService.create(blogObject);
      // Dispatch the action instead of using setBlogs
      dispatch({ type: "CREATE_BLOG", payload: newBlog });
      dispatch(
        setSuccessNotification({
          text: `A new blog titled ${newBlog.title} by ${newBlog.author} added.`,
          error: false,
        })
      );
    } catch (error) {
      dispatch(
        setErrorNotification({
          text: "Posting new blog failed",
          error: true,
        })
      );
    }
  };

  const updateBlog = async (blog) => {
    try {
      dispatch({
        type: "UPDATE_BLOG",
        payload: { ...blog, likes: blog.likes + 1 },
      });
      await blogService.update(blog.id, blog);

      const updatedBlogs = await blogService.getAll();
      dispatch({ type: "INIT_BLOGS", payload: updatedBlogs });

      dispatch(
        setSuccessNotification({
          text: `${blog.title} liked.`,
          error: false,
        })
      );
    } catch (error) {
      // Revert the UI state on error
      dispatch({
        type: "UPDATE_BLOG",
        payload: { ...blog, likes: blog.likes - 1 },
      });

      dispatch(
        setErrorNotification({
          text: `Liking ${blog.title} failed.`,
          error: true,
        })
      );
    }
  };

  const deleteBlog = async (id, blog) => {
    try {
      if (window.confirm(`Remove blog: "${blog.title}"?`)) {
        await blogService.deleteBlog(id);
        const response = await blogService.getAll();
        dispatch({ type: "INIT_BLOGS", payload: response });
        dispatch(
          setSuccessNotification({
            text: `${blog.title} has been removed.`,
            error: false,
          })
        );
      }
    } catch (error) {
      console.log(error);
      dispatch(
        setErrorNotification({
          text: `Deleting ${blog.title} failed.`,
          error: true,
        })
      );
    }
  };

  if (user === null) {
    return (
      <div>
        <Notification />
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
      <Notification />
      <h2>Blogs</h2>
      <div>
        <p>{`${user.name} logged in `}</p>
        <button onClick={handleLogout}>Logout</button>
        <div>
          {blogs.length > 0 ? (
            blogs.map((blog) => (
              <Blog
                key={blog.id}
                blog={blog}
                updateBlog={updateBlog}
                deleteBlog={deleteBlog}
                username={user.username}
              />
            ))
          ) : (
            <p>No blogs available</p>
          )}
        </div>
        <Toggable buttonLabel="Create new blog">
          <BlogForm createBlog={createBlog} />
        </Toggable>
      </div>
    </div>
  );
};

export default App;
