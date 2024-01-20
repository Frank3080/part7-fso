import { configureStore } from '@reduxjs/toolkit';
import blogReducer from './src/reducers/blogReducer';
import notificationReducer from './src/reducers/notificationReducer';
import userReducer from './src/reducers/userReducer';

const store = configureStore({
    reducer: {
        notification: notificationReducer,
        blogs: blogReducer,
        user: userReducer,
    }
})

export default store