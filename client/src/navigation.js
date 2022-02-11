import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { NavigationContainer } from '@react-navigation/native'
import {
  CardStyleInterpolators,
  createStackNavigator,
  TransitionPresets
} from '@react-navigation/stack'
import * as React from 'react'
import { Linking } from 'react-native'
import 'react-native-gesture-handler'
import TabBar from './components/TabBar'
import DarkTheme from './constants/dark-theme'
import DefaultTheme from './constants/default-theme'
import { ThemeContext } from './context/themeSwichContext'
import ChatScreen from './views/Chat'
import CreatePostScreen from './views/CreatePost'
import FriendsScreens from './views/friends'
import HomeScreen from './views/Home'
import PostDetail from './views/PostDetail'
import SignInScreen from './views/SignIn'
import SignModal from './views/SignModal'
import SignUpScreen from './views/SignUp'
import UserScreen from './views/User'
import messaging from '@react-native-firebase/messaging'
import { SafeAreaView } from 'react-native'
import { useTheme } from '@react-navigation/native'
import Terms from './components/Terms'
import AsyncStorage from '@react-native-community/async-storage'

const Tab = createBottomTabNavigator()
const HomeStack = createStackNavigator()
const SignStack = createStackNavigator()
const RootStack = createStackNavigator()

function SignScreens() {
  return (
    <SignStack.Navigator
      headerMode="screen"
      screenOptions={{
        initialRouteName: 'SignModal',
        gestureEnabled: true,
        gestureDirection: 'vertical',
        ...TransitionPresets.ModalSlideFromBottomIOS,
        cardStyle: {
          backgroundColor: 'transparent'
        },
        headerShown: false
      }}
    >
      <SignStack.Screen name="SignModal" component={SignModal} />
      <SignStack.Screen name="SignUp" component={SignUpScreen} />
      <SignStack.Screen name="SignIn" component={SignInScreen} />
    </SignStack.Navigator>
  )
}

function HomeScreens() {
  return (
    <HomeStack.Navigator
      screenOptions={{
        gestureEnabled: true,
        gestureDirection: 'horizontal',
        ...TransitionPresets.SlideFromRightIOS
      }}
    >
      <HomeStack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <HomeStack.Screen
        name="PostDetail"
        component={PostDetail}
        options={({ route }) => ({
          headerTitle: route.params.category,
          headerStyle: { height: 40 },
          headerTitleStyle: {
            fontSize: 16
          },
          headerTitleAlign: 'center'
        })}
      />
      <HomeStack.Screen name="Chat" component={ChatScreen} />
    </HomeStack.Navigator>
  )
}

function MyTabs({ navigation }) {
  React.useEffect(() => {
    checkNotification()
  }, [])

  const checkNotification = async () => {
    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log('onNotificationOpenedApp', remoteMessage)
      const { data } = remoteMessage
      const { type } = data
      switch (type) {
        case 'request':
          return navigation.navigate('Friends')
        case 'accepted':
          return navigation.navigate('Friends')
      }
    })
  }

  return (
    <Tab.Navigator
      tabBar={props => <TabBar {...props} />}
      screenOptions={{
        animationEnabled: true
      }}
    >
      <Tab.Screen name="Home" component={HomeScreens} />
      <Tab.Screen name="Friends" component={FriendsScreens} />
      <Tab.Screen name="CreatePost" component={CreatePostScreen} />
      <Tab.Screen name="User" component={UserScreen} />
    </Tab.Navigator>
  )
}

function RootScreen() {
  const { theme } = React.useContext(ThemeContext)
  const [accepted, setAccepted] = React.useState(false)

  const linking = {
    prefixes: ['https://app.community.client.com']
  }

  React.useEffect(() => {
    AsyncStorage.getItem('terms').then(data => {
      setAccepted(data && data === 'accepted')
    })
  }, [])

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: theme === 'light' ? DefaultTheme.colors.bgColor : DarkTheme.colors.bgColor
      }}
    >
      <Terms visible={!accepted} setVisible={setAccepted} />
      <NavigationContainer linking={linking} theme={theme === 'light' ? DefaultTheme : DarkTheme}>
        <RootStack.Navigator
          screenOptions={{
            headerShown: false,
            cardStyle: { backgroundColor: 'transparent' },
            cardStyleInterpolator: CardStyleInterpolators.forModalPresentationIOS,
            gestureEnabled: true,
            gestureDirection: 'vertical'
          }}
          mode="modal"
        >
          <RootStack.Screen name="Tab" component={MyTabs} />
          <RootStack.Screen name="SignModal" component={SignScreens} />
        </RootStack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  )
}

export default RootScreen
