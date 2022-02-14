import { useTheme } from '@react-navigation/native'
import React, { useContext, useEffect, useState } from 'react'
import {
  ActivityIndicator,
  Image,
  Keyboard,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native'
import ImagePicker from 'react-native-image-crop-picker'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import instanceAxios from '../utils/fetcher'
import Button from './Button'
import { Plus } from './icons/index'

import Clipboard from '@react-native-clipboard/clipboard'
import { AuthContext } from '../context/authContext'
import AsyncStorage from '@react-native-community/async-storage'
import uploadImage from '../utils/uploadImage'
import Modal from 'react-native-modal'

const _topics = []
for (var i = 0; i < 7; i++) _topics.push('')

export default function CreateRoom({ visible, setVisible }) {
  const { colors } = useTheme()
  const { authState, setAuthState } = useContext(AuthContext)
  const [name, setName] = useState('')
  const [avatar, setAvatar] = useState('')
  const [topics, setTopics] = useState(_topics)
  const [activeTopic, setActiveTopic] = useState('')
  const [activeTopicIndex, setActiveTopicIndex] = useState(null)
  const [errors, setErrors] = useState([])
  const [loading, setLoading] = useState(false)
  const [created, setCreated] = useState(false)
  const [link, setLink] = useState(null)

  useEffect(() => {
    return () => {
      // setCreated(false)
      // setName('')
      // setAvatar('')
      // setTopics(_topics)
      // setLink(null)
    }
  }, [])

  const handleImage = () => {
    try {
      ImagePicker.openPicker({
        width: 550,
        height: 550,
        cropping: true,
        multiple: false
      }).then(async image => {
        setAvatar(image.path)
      })
    } catch (err) {
      console.log('error picking images', err)
    }
  }

  const handleCreateRoom = async () => {
    const _errors = handleValidate()
    if (_errors.length) return setErrors(_errors)
    const uploadImageResponse = await uploadImage(avatar)
    if (uploadImageResponse.err) return err
    const payload = {
      room: { name, avatar: uploadImageResponse.url, topics, members: [authState.userInfo.id] },
      userId: authState.userInfo.id
    }
    setLoading(true)
    const response = await instanceAxios.post(`room/`, payload)
    const responseData = await response.data
    setLoading(false)
    if (responseData.status === 'error') return
    const { data } = responseData
    setLink(`app.community://room/invite/${data.id}`)
    setCreated(true)
    const _user = authState.userInfo
    _user.rooms ? _user.rooms.push(data.id) : (_user.rooms = [data.id])
    setAuthState({ ...authState, userInfo: _user })
    await AsyncStorage.setItem('userInfo', JSON.stringify(_user))
  }

  const handleValidate = () => {
    let _errors = []
    if (!name.length) _errors.push('name')
    if (!avatar) _errors.push('avatar')
    topics.map((item, index) => {
      if (item === '') _errors.push(`topic${index}`)
    })
    return _errors
  }

  const renderItem = (item, index) => (
    <>
      <TextInput
        key={index}
        value={activeTopicIndex === index ? activeTopic : item}
        onFocus={() => setActiveTopicIndex(index)}
        onChangeText={e => {
          setActiveTopic(e)
        }}
        onBlur={() => {
          setTopics(prev => {
            prev[index] = activeTopic
            return prev
          })
          setActiveTopic('')
          setActiveTopicIndex(null)
        }}
        style={[styles.input, { borderBottomColor: colors.border, color: colors.text }]}
        placeholder={`Topic ${index + 1}`}
        placeholderTextColor={colors.border}
      />
      {errors.includes(`topic${index}`) && (
        <Text style={[styles.error, { marginLeft: '10%' }]}>Please enter a valid topic name</Text>
      )}
    </>
  )

  return (
    <Modal isVisible={visible} style={[styles.modal, { backgroundColor: colors.background }]}>
      <StatusBar backgroundColor={colors.background} />

      <TouchableOpacity
        onPress={() => setVisible(false)}
        style={{ position: 'absolute', right: 15, top: '5%', zIndex: 1000 }}
      >
        <Text style={{ color: colors.primary }}>Close</Text>
      </TouchableOpacity>

      {created ? (
        <RoomCreated link={link} />
      ) : (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={[styles.modal, { backgroundColor: colors.background }]}>
            <TouchableWithoutFeedback onPress={handleImage}>
              <View style={[styles.avatar, { backgroundColor: colors.bgColor }]}>
                {avatar ? (
                  <Image
                    style={[styles.avatar, { backgroundColor: colors.bgColor }]}
                    source={{ uri: avatar }}
                  />
                ) : (
                  <Plus color={colors.text} />
                )}
              </View>
            </TouchableWithoutFeedback>
            {errors.includes('avatar') && (
              <Text style={[styles.error, { textAlign: 'center' }]}>Please choose an avatar</Text>
            )}

            <TextInput
              style={[styles.input, { borderBottomColor: colors.border, color: colors.text }]}
              placeholder="Room name"
              placeholderTextColor={colors.border}
              value={name}
              onChangeText={e => setName(e)}
            />
            {errors.includes('name') && (
              <Text style={[styles.error, { marginLeft: '10%' }]}>
                Please enter a valid room name
              </Text>
            )}
            <KeyboardAwareScrollView style={{ flex: 1, marginTop: 15 }} enableOnAndroid>
              <Text style={[styles.heading, { marginLeft: '10%', color: colors.text }]}>
                Topics
              </Text>
              {topics.map(renderItem)}

              <View style={{ marginTop: 20 }}>
                <Button
                  onPress={handleCreateRoom}
                  title="Create Room"
                  bgColor={colors.signUpButton}
                >
                  {loading && <ActivityIndicator color="#fff" />}
                </Button>
              </View>
            </KeyboardAwareScrollView>
          </View>
        </TouchableWithoutFeedback>
      )}
    </Modal>
  )
}

const RoomCreated = ({ link }) => {
  const { colors } = useTheme()
  const [tapped, setTapped] = useState(false)

  const handleCopy = () => {
    Clipboard.setString(link)
    setTapped(true)
  }

  return (
    <View
      style={[
        styles.modal,
        { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }
      ]}
    >
      <Image style={styles.tick} source={require('../icons/tick-mark.png')} />
      <Text style={[styles.heading, { color: colors.text }]}>Room created successfully!</Text>
      <Text style={{ color: colors.text }}>Share this link to invite people</Text>
      <TouchableOpacity onPress={handleCopy}>
        <Text style={{ color: colors.primary, marginTop: 20, textAlign: 'center' }}>{link}</Text>
      </TouchableOpacity>
      <Text style={{ color: colors.border, fontSize: 10, marginTop: 10 }}>
        {tapped ? 'Copied!' : 'Tap the link to copy'}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    margin: 0,
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
    fontWeight: 'bold'
  },
  input: {
    width: '80%',
    borderBottomWidth: 0.5,
    alignSelf: 'center',
    marginTop: 15
  },
  error: {
    color: 'crimson',
    marginTop: 2,
    fontSize: 12
  },
  tick: {
    height: 100,
    width: 100
  }
})
