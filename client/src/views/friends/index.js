import { createStackNavigator, TransitionPresets } from '@react-navigation/stack'
import React, { useContext, useEffect, useRef, useState } from 'react'
import Chat from '../Chat'
import { StatusBar, Text, TouchableWithoutFeedback, View } from 'react-native'
import styles from './components/styles'
import { useTheme } from '@react-navigation/native'
import UsersList from './components/UsersList'
import FriendRequests from './components/FriendRequests'
import axios from '../../utils/fetcher'
import Input from './components/search/components/Input'
import { AuthContext } from '../../context/authContext'
import AwesomeDebouncePromise from 'awesome-debounce-promise'

export function Friends({ navigation }) {
  const { colors } = useTheme()
  const { authState } = useContext(AuthContext)
  const [users, setUsers] = useState([])
  const friends = useRef([])
  const [query, setQuery] = useState('')

  useEffect(() => {
    handleGetData()
  }, [])

  const handleGetData = async () => {
    if (!authState.userInfo.friends || !authState.userInfo.friends.length) return
    const response = await axios.get(`users?ids=${authState.userInfo.friends.join(',')}`)
    const data = await response.data
    if (data.status === 'success') {
      setUsers(data.users)
      friends.current = data.users
    }
  }

  const onChangeText = e => {
    setQuery(e)
    if (e.length === 0) {
      return setUsers(friends.current)
    } else {
      const asyncFunctionDebounced = AwesomeDebouncePromise(() => handleSearch(e), 500)
      asyncFunctionDebounced()
    }
  }

  const handleSearch = async e => {
    if (query.length === 0) return
    const response = await axios.get(`user/search/${e}`)
    const data = await response.data
    setUsers(data.users)
  }

  return (
    <View style={styles.screen}>
      <StatusBar backgroundColor={colors.bgColor} />
      <Input
        showFriends={() => setUsers(friends.current)}
        value={query}
        onChangeText={onChangeText}
      />
      <TouchableWithoutFeedback onPress={() => navigation.navigate('FriendRequests')}>
        <View style={[styles.button, { backgroundColor: colors.bgColor, marginTop: 15 }]}>
          <Text style={[styles.tileLabel, { color: colors.text }]}>Friend Requests</Text>
        </View>
      </TouchableWithoutFeedback>

      <UsersList users={users} navigation={navigation} />
    </View>
  )
}

const Stack = createStackNavigator()
export default function() {
  return (
    <Stack.Navigator
      headerMode="screen"
      screenOptions={{
        gestureEnabled: true,
        gestureDirection: 'vertical',
        ...TransitionPresets.ModalSlideFromBottomIOS
      }}
    >
      <Stack.Screen name="Friends" component={Friends} options={{ headerShown: false }} />
      <Stack.Screen
        name="FriendRequests"
        component={FriendRequests}
        options={{ headerTitle: 'Friend Requests' }}
      />
      <Stack.Screen name="Chat" component={Chat} />
    </Stack.Navigator>
  )
}
