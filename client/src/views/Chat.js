import firestore from '@react-native-firebase/firestore'
import { useTheme } from '@react-navigation/native'
import React, { useCallback, useContext, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { ActivityIndicator, StatusBar, View } from 'react-native'
import { GiftedChat } from 'react-native-gifted-chat'
import { AuthContext } from '../context/authContext'
import { updateMessages } from '../utils/firebase'
import { renderComposer, renderInputToolbar } from './chatComponents.'

function sortString(str) {
  var arr = str.split('')
  var tmp
  for (var i = 0; i < arr.length; i++) {
    for (var j = i + 1; j < arr.length; j++) {
      if (arr[i] > arr[j]) {
        tmp = arr[i]
        arr[i] = arr[j]
        arr[j] = tmp
      }
    }
  }
  return arr.join('')
}

export default function Chat({ route, navigation }) {
  const { remoteUser } = route.params
  const [messages, setMessages] = useState([])
  const { authState } = useContext(AuthContext)
  const { colors } = useTheme()
  const [loading, setLoading] = useState(true)
  const [firstRender, setFirstRender] = useState(true)
  const listenerRef = useRef(null)
  const uniqueString =
    authState.userInfo.id + remoteUser.id + authState.userInfo.username + remoteUser.username
  const sortedId = sortString(uniqueString)

  useEffect(() => {
    navigation.setOptions({
      headerTitle: remoteUser.username,
      headerStyle: {
        backgroundColor: colors.bgColor
      }
    })
  }, [])

  useLayoutEffect(() => {
    handleListener()
    return () => {
      listenerRef.current && listenerRef.current()
    }
  }, [])

  const handleListener = () => {
    listenerRef.current = firestore()
      .collection('chat')
      .doc(sortedId)
      .collection('messages')
      .orderBy('createdAt', 'desc')
      .onSnapshot(async querySnapshot => {
        if (firstRender) {
          setMessages(
            querySnapshot.docs.map(item => ({
              ...item.data(),
              createdAt: new Date(item.data().createdAt.seconds * 1000)
            }))
          )
          setLoading(false)
          setFirstRender(false)
        } else {
          const changes = querySnapshot.docChanges().map(item => item.doc.data())
          if (changes && changes.length) {
            if (changes[0].user.name !== authState.userInfo.username)
              GiftedChat.append(messages, changes)
          }
        }
      })
  }

  const onSend = useCallback(async (messages = []) => {
    setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
    await updateMessages(sortedId, messages[0])
  }, [])

  const renderLoading = () => (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <ActivityIndicator color={colors.primary} size="small" />
    </View>
  )

  return (
    <>
      <StatusBar backgroundColor={colors.bgColor} />
      <GiftedChat
        messages={messages}
        isLoadingEarlier={loading}
        renderLoading={renderLoading}
        onSend={messages => onSend(messages)}
        user={{
          _id: authState.userInfo.id,
          name: authState.userInfo.username
        }}
        showAvatarForEveryMessage={true}
        renderComposer={props => renderComposer(props, colors.text, colors.background)}
        renderInputToolbar={props => renderInputToolbar(props, colors.background)}
      />
    </>
  )
}
