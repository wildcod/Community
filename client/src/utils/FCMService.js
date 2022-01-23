import messaging from '@react-native-firebase/messaging'
import { Platform } from 'react-native'

class FCMService {
  register = onOpenNotification => {
    this.checkPermission()
    this.createNotificationListeners(onOpenNotification)
    this.tokenRefresh
    messaging().onMessageSent(evt => {})
  }

  registerAppWithFCM = async () => {
    if (Platform.OS === 'ios') {
      await messaging().registerDeviceForRemoteMessages()
      await messaging().setAutoInitEnabled(true)
    }
  }

  checkPermission = async () => {
    const enabled = await messaging().hasPermission()
    if (!enabled) {
      this.requestPermission()
    }
  }

  requestPermission = async () => {
    await messaging().requestPermission()
  }

  checkToken = async (token, notifID) => {
    const fcmToken = await messaging().getToken()
    console.log('fcmToken', fcmToken)
  }

  tokenRefresh = async token => {
    messaging().onTokenRefresh(async fcmToken => {})
  }

  deleteToken = () => {
    messaging()
      .deleteToken()
      .catch(error => {})
  }

  createNotificationListeners = onOpenNotification => {
    // When the application is running, but in the background
    messaging().onNotificationOpenedApp(remoteMessage => {
      if (remoteMessage) {
        const notification = remoteMessage
        onOpenNotification(notification)
        this.removeDeliveredNotification(notification.notificationId)
      }
    })

    // When the application is opened from a quit state.
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          const notification = remoteMessage
          onOpenNotification(notification)
          //  this.removeDeliveredNotification(notification.notificationId)
        }
      })
  }

  // // Foreground state messages
  messageListener = onMessageCallback => {
    messaging().onMessage(() => onMessageCallback)
  }

  sendNotification = (data, regIds, title, body) => {
    const FIREBASE_API_KEY =
      'AAAA-vg5mb4:APA91bE55sDjl1YaO9i9Um6u92qiHUoftJaIIv1z9WmZMN9cbulTJnM7JBLYhil9b7EOTlbFRiSJqg_fjjqRpP83gqNPEAkG7gJ-EI3rohqUJB6aVXP1dqL_8t5UbgNo8J-ci92_PS8j'
    const message = {
      registration_ids: regIds,
      notification: {
        title: title,
        body: body,
        vibrate: 1,
        sound: 1,
        badge: 1,
        show_in_foreground: true,
        priority: 'high',
        content_available: true
      },
      data: data
    }
    sendNotifactionFirebaseApi(message, FIREBASE_API_KEY)
  }

  unRegister = () => {
    this.messageListener()
  }
}

const sendNotifactionFirebaseApi = async (message, apiKey) => {
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `key=${apiKey}`
    },
    body: JSON.stringify(message)
  }

  return fetch('https://fcm.googleapis.com/fcm/send', requestOptions)
    .then(response => response.text())
    .then(data => {
      return data
    })
}

export const fcmService = new FCMService()
