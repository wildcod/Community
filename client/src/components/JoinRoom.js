import AsyncStorage from '@react-native-community/async-storage'
import { useTheme } from '@react-navigation/native'
import React, { useContext, useEffect, useState } from 'react'
import {
  ActivityIndicator,
  Linking,
  Modal,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image
} from 'react-native'
import { AuthContext } from '../context/authContext'
import instanceAxios from '../utils/fetcher'
import Button from './Button'

export default function JoinRoom({ visible, setVisible }) {
  const { authState, setAuthState } = useContext(AuthContext)
  const { colors } = useTheme()
  const [room, setRoom] = useState({})
  const [loading, setLoading] = useState(false)
  const [url, setUrl] = useState('')

  useEffect(() => {
    Linking.getInitialURL().then(_url => {
      setUrl(_url)
      getData(_url)
    })
  }, [])

  useEffect(() => {
    const id = url.split('/').slice(-1)[0]
    if (
      authState &&
      authState.userInfo &&
      url.length &&
      authState.userInfo.rooms.indexOf(id) !== -1
    )
      setVisible(false)
  }, [authState.userInfo, url])

  const getData = async _url => {
    const id = _url.split('/').slice(-1)[0]
    const response = await instanceAxios.get(`room/${id}`)
    const respnoseData = await response.data
    if (respnoseData.status === 'error') return
    setRoom(respnoseData.data)
  }

  const handleJoinRoom = async () => {
    setLoading(true)
    const response = await instanceAxios.post(
      `room/join?userId=${authState.userInfo.id}&roomId=${room.id}`
    )
    const responseData = await response.data
    console.log('responseData', responseData)
    setLoading(false)
    if (responseData.status === 'error') return
    const _user = responseData.data
    setAuthState({ ...authState, userInfo: _user })
    setVisible(false)
    await AsyncStorage.setItem('userInfo', JSON.stringify(_user))
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      style={[styles.modal, { backgroundColor: colors.background }]}
      statusBarTranslucent={true}
    >
      <StatusBar backgroundColor={colors.background} />

      <TouchableOpacity
        onPress={() => setVisible(false)}
        style={{ position: 'absolute', right: 15, top: '5%', zIndex: 1000 }}
      >
        <Text style={{ color: colors.primary }}>Close</Text>
      </TouchableOpacity>

      <View style={[styles.modal, { backgroundColor: colors.background }]}>
        <Image
          style={[styles.avatar, { backgroundColor: colors.bgColor }]}
          source={{ uri: room.avatar }}
        />
        <Text style={[styles.heading, { color: colors.text }]}>{room.name}</Text>
        <Text style={[{ color: colors.text, alignSelf: 'center' }]}>
          {room.members && room.members.length} members
        </Text>
        <View style={{ marginTop: 30, height: 65 }}>
          <Button onPress={handleJoinRoom} title="Join Room" bgColor={colors.signUpButton}>
            {loading && <ActivityIndicator color="#fff" />}
          </Button>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    paddingVertical: '20%'
  },
  avatar: {
    width: 75,
    height: 75,
    borderRadius: 75 / 2,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center'
  },
  heading: {
    fontSize: 20,
    marginTop: 25,
    alignSelf: 'center',
    fontWeight: 'bold'
  }
})