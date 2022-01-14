import React, { useState } from 'react'
import { View } from 'react-native'
import Input from './components/Input'
import styles from './components/styles'
import axios from '../../utils/fetcher'
import List from './components/List'
import {
  createStackNavigator,
  TransitionPresets,
  CardStyleInterpolators
} from '@react-navigation/stack'

import AwesomeDebouncePromise from 'awesome-debounce-promise'
import Chat from '../Chat'

export function Search({ navigation }) {
  const [query, setQuery] = useState('')
  const [users, setUsers] = useState([])

  const onChangeText = e => {
    setQuery(e)
    if (e.length === 0) return
    const asyncFunctionDebounced = AwesomeDebouncePromise(() => handleSearch(e), 500)
    asyncFunctionDebounced()
  }

  const handleSearch = async e => {
    const response = await axios.get(`user/search/${e}`)
    const data = await response.data
    setUsers(data.users)
  }

  return (
    <View style={styles.screen}>
      <Input value={query} onChangeText={onChangeText} />
      <List users={users} navigation={navigation} />
    </View>
  )
}

const Stack = createStackNavigator()
export default function() {
  return (
    <Stack.Navigator
      headerMode="screen"
      screenOptions={{
        initialRouteName: 'Search',
        gestureEnabled: true,
        gestureDirection: 'vertical',
        ...TransitionPresets.ModalSlideFromBottomIOS
        // cardStyle: {
        //   backgroundColor: 'transparent'
        // },
      }}
    >
      <Stack.Screen name="Search" component={Search} options={{ headerShown: false }} />
      <Stack.Screen name="Chat" component={Chat} />
    </Stack.Navigator>
  )
}
