import React from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import {SafeAreaView} from 'react-native';
if (__DEV__) {
  import('../ReactotronConfig').then(() => console.log('Reactotron Configured'))
}

import { AuthProvider } from './context/authContext'
import { RoomProvider } from './context/roomContext'
import { ThemeProvider } from './context/themeSwichContext'
import Navigation from './navigation'
import { initializeFCM } from './utils/fcmFunctions'
import { useTheme } from '@react-navigation/native';

const App = () => {
  const {colors} = useTheme()
  React.useEffect(() => {
    initializeFCM()
  }, [])
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.background}}>
      <AuthProvider>
        <ThemeProvider>
          <RoomProvider>
            <Navigation />
          </RoomProvider>
        </ThemeProvider>
      </AuthProvider>
    </SafeAreaView>
  )
}

export default App
