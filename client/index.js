/**
 * @format
 */

import { AppRegistry } from 'react-native'
import App from './src/app'
import { name as appName } from './app.json'

import messaging from '@react-native-firebase/messaging'
import PushNotification from 'react-native-push-notification'
import { localNotificationService } from './src/utils/LocalNotificationService'

messaging().setBackgroundMessageHandler(async remoteMessage => {
  PushNotification.localNotification(remoteMessage)
})

localNotificationService.configure()

AppRegistry.registerComponent(appName, () => App)
