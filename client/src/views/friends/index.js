import { createStackNavigator, TransitionPresets } from '@react-navigation/stack'
import React from 'react'
import Search from './components/search'
import Chat from '../Chat'
import { Text, View } from 'react-native'

export function Friends({ navigation }) {
  return (
    <View>
      <Text onPress={() => navigation.navigate('Search')}>Search</Text>
      <Text onPress={() => navigation.navigate('Requests')}>Requests</Text>
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
      <Stack.Screen name="Search" component={Search} options={{ headerShown: false }} />
      <Stack.Screen name="Chat" component={Chat} />
    </Stack.Navigator>
  )
}
