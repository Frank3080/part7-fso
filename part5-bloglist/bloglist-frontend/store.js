import { configureStore } from '@reduxjs/toolkit';
import blogReducer from './src/reducers/blogReducer';
import notificationReducer from './src/reducers/notificationReducer';

const store = configureStore({
    reducer: {
        notification: notificationReducer,
        blogs: blogReducer,
    }
})

export default store