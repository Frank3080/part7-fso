import blogService from "../services/blogs";

const initialState = [];

const blogReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'INIT_BLOGS':
      return action.payload;
    case 'CREATE_BLOG':
      return [...state, action.payload];
    case 'UPDATE_BLOG':
      return state.map((blog) => (blog.id === action.payload.id ? action.payload : blog));
    case 'DELETE_BLOG':
      return state.filter((blog) => blog.id !== action.payload);
    default:
      return state;
  }
};

export const createBlog = (newBlog) => {
  return async (dispatch) => {
    try {
      const blog = await blogService.create(newBlog);
      dispatch({
        type: 'CREATE_BLOG',
        payload: blog,
      });
    } catch (err) {
      console.error(err);
    }
  };
};

export const updateBlog = (updatedBlog) => {
  return async (dispatch) => {
    try {
      await blogService.update(updatedBlog.id, updatedBlog);
      dispatch({
        type: 'UPDATE_BLOG',
        payload: updatedBlog,
      });
    } catch (error) {
      console.error('Error updating blog:', error);
    }
  };
};

export const deleteBlog = (blogId) => {
  return async (dispatch) => {
    try {
      await blogService.deleteBlog(blogId);
      dispatch({
        type: 'DELETE_BLOG',
        payload: blogId,
      });
    } catch (error) {
      console.error('Error deleting blog:', error);
    }
  };
};

export default blogReducer;