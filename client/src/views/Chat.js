import { useTheme } from '@react-navigation/native'
import React, { useCallback, useContext, useEffect, useLayoutEffect, useState } from 'react'
import { StyleSheet } from 'react-native'
import { GiftedChat } from 'react-native-gifted-chat'
import { ThemeContext } from '../context/themeSwichContext'
import { AuthContext } from '../context/authContext'
import { renderComposer, renderInputToolbar } from './chatComponents.'
import { getChatMessages, updateMessages } from '../utils/firebase'

export default function Chat({ route }) {
  const { author } = route.params
  const [messages, setMessages] = useState([])
  const { theme } = useContext(ThemeContext)
  const { authState } = useContext(AuthContext)
  const { colors } = useTheme()

  useLayoutEffect(() => {
    handleGetData()
  }, [])

  const handleGetData = async () => {
    const _messages = await getChatMessages(authState.userInfo.id, author.id)
    console.log('_messages', _messages)
  }

  const onSend = useCallback(async (messages = []) => {
    console.log('messages', messages)
    setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
    await updateMessages(authState.userInfo.id, author.id, messages[0])
  }, [])

  return (
    <GiftedChat
      messages={messages}
      onSend={messages => onSend(messages)}
      user={{
        _id: authState.userInfo.id,
        name: authState.userInfo.username,
        avatar: 'https://placeimg.com/140/140/any'
      }}
      showAvatarForEveryMessage={true}
      renderComposer={props => renderComposer(props, colors.text, colors.background)}
      renderInputToolbar={props => renderInputToolbar(props, colors.background)}
    />
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end'
  }
})
