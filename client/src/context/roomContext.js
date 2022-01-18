import React from 'react'

const RoomContext = React.createContext()
const { Provider } = RoomContext

const RoomProvider = ({ children }) => {
  const [activeRoom, setActiveRoom] = React.useState(null)

  return <Provider value={{ activeRoom, setActiveRoom }}>{children}</Provider>
}

export { RoomProvider, RoomContext }
