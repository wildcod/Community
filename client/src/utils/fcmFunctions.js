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
    // if (notify.data.type === 'schedulePodcast') {
    //   scheduleNotification()
    // } else {
    showNotification()
    // }

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

  function onOpenNotification(data) {
    console.log('onOpenNotification', data)
  }

  return () => {
    fcmService.unRegister()
    localNotificationService.unregister()
  }
}

export const unregister = async () => {
  fcmService.unRegister()
  localNotificationService.unregister()
}

// const a = {
//   collapseKey: 'com.community.firstreleaseapp',
//   data: {
//     remoteUser:
//       '{"rooms":[],"role":"user","requests":[],"avatar":"https:\\/\\/community-app-images.s3.amazonaws.com\\/406pw2p-ju1kuur.jpg","id":"61ed9efc7a783e4089d37824","fcmToken":"dCQFH_OwSoCZRBElcOMCUv:APA91bE6jU-hzCzG-j7dw22pWlr4YTm-PZMV8Cr77OXy9ezd4LlhBxtmNDzp4XSneG5FUvXmjbc2y59thYzeNgcVhAeZ2ybS_3hQGXkfqnmXmTYB-Sw5LCOgepiFxtKuw0DwVuEjo12o","friends":["61de721d5787563215d63340"],"username":"newtest5"}'
//   },
//   from: '1077906348478',
//   messageId: '0:1643001675304166%b8b5fcefb8b5fcef',
//   notification: { android: { sound: '1' }, body: 'yo', title: 'newtest5' },
//   sentTime: 1643001675287,
//   ttl: 2419200
// }

const a = {
  rooms: [],
  role: 'user',
  requests: [],
  avatar: 'https:\\/\\/community-app-images.s3.amazonaws.com\\/406pw2p-ju1kuur.jpg',
  id: '61ed9efc7a783e4089d37824',
  fcmToken:
    'dCQFH_OwSoCZRBElcOMCUv:APA91bE6jU-hzCzG-j7dw22pWlr4YTm-PZMV8Cr77OXy9ezd4LlhBxtmNDzp4XSneG5FUvXmjbc2y59thYzeNgcVhAeZ2ybS_3hQGXkfqnmXmTYB-Sw5LCOgepiFxtKuw0DwVuEjo12o',
  friends: ['61de721d5787563215d63340'],
  username: 'newtest5'
}
