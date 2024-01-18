import {useSelector} from 'react-redux'

const Notification = () => {
  const message = useSelector(state => state.notification)

  const success = {
    background: "lightgrey",
    fontSize: 20,
    borderStyle: "solid",
    borderRadius: 5,
    padding: 10,
    color: "green",
    marginBottom: 10,
  };

  const error = {
    background: "lightgrey",
    fontSize: 20,
    borderStyle: "solid",
    borderRadius: 5,
    padding: 10,
    color: "red",
    marginBottom: 10,
  };

  if (message === null) {
    return null
}

if (message.error) {
    return (
        <div style={error}>
            {message.text}
        </div>
    )
} else {
    return (
        <div style={success}>
            {message.text}
        </div>
    )
}
}

export default Notification
