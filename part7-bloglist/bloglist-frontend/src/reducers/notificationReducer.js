import { createSlice } from "@reduxjs/toolkit"

const notificationReducer = createSlice({
    name: 'notification',
    initialState: null,
    reducers: {
        setNotification(state, action){
            console.log(action.payload)
            return action.payload
        },
        setErrNotification(state, action) {
            return action.payload
        }
    }
})

export const setSuccessNotification = (content) => {
    return dispatch => {
        console.log(content)
        dispatch(setNotification(content))
        setTimeout(() => {
            dispatch(setNotification(null))
        }, 5000);
    }
}

export const setErrorNotification = (content) => {
    return dispatch => {
        dispatch(setErrNotification(content))
        setTimeout(() => {
            dispatch(setErrNotification(null))
        }, 5000);
    }
}


export const {setNotification, setErrNotification} = notificationReducer.actions
export default notificationReducer.reducer