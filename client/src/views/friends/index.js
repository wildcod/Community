import { createStackNavigator, TransitionPresets } from '@react-navigation/stack'
import React from 'react'
import Search from './components/search'
import Chat from '../Chat'
import { Text, TouchableWithoutFeedback, View } from 'react-native'
import styles from './components/styles'
import { useTheme } from '@react-navigation/native'
import FriendsList from './components/FriendsList'
import FriendRequests from './components/FriendRequests'

export function Friends({ navigation }) {
  const { colors } = useTheme()
  return (
    <View style={styles.screen}>
      <Text onPress={() => navigation.navigate('Search')}>Search</Text>

      <TouchableWithoutFeedback onPress={() => navigation.navigate('FriendRequests')}>
        <View style={[styles.button, { backgroundColor: colors.bgColor }]}>
          <Text style={[styles.tileLabel, { color: colors.text }]}>Friend Requests</Text>
        </View>
      </TouchableWithoutFeedback>

      <FriendsList navigation={navigation} />
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
      <Stack.Screen name="Search" component={Search} options={{ headerShown: false }} />
      <Stack.Screen name="Chat" component={Chat} />
    </Stack.Navigator>
  )
}
