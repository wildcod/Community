import { fcmService } from './FCMService'
import { localNotificationService } from './LocalNotificationService'

export const initFCM = (token, notificationID) => {
  fcmService.checkToken(token, notificationID)
}

export const initializeFCM = (token, notificationID) => {
  initFCM(token, notificationID)
  fcmService.registerAppWithFCM()
  fcmService.register(onNotification, onOpenNotification)
  localNotificationService.configure(onOpenNotification)

  function onNotification(notify) {
    if (notify.data.type === 'schedulePodcast') {
      scheduleNotification()
    } else {
      showNotification()
    }

    const options = {
      soundName: 'default',
      playSound: true,
      largeIcon: 'logo',
      smallIcon: 'logo'
    }

    const showNotification = () => {
      localNotificationService.showNotification(
        0,
        notify.notification.title,
        notify.notification.body,
        notify.data,
        token,
        options
      )
    }

    const scheduleNotification = () => {
      localNotificationService.scheduleNotification(
        0,
        notify.notification.title,
        notify.notification.body,
        notify.data,
        token,
        options
      )
    }
  }

  function onOpenNotification(data) {}

  return () => {
    fcmService.unRegister()
    localNotificationService.unregister()
  }
}

export const unregister = async () => {
  fcmService.unRegister()
  localNotificationService.unregister()
}
