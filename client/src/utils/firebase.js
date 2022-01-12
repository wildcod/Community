import firestore from '@react-native-firebase/firestore'

export const getChatMessages = async (userId, remoteId) => {
  const snapshot = await firestore()
    .collection('chat')
    .doc(`${userId}-${remoteId}`)
    .collection('messages')
    .orderBy('createdAt', 'desc')
    .get()
  return snapshot.docs.map(doc => ({
    _id: doc.data()._id,
    createdAt: doc.data().createdAt.toDate(),
    text: doc.data().text,
    user: doc.data().user
  }))
}

export const updateMessages = async (userId, remoteId, message) => {
  return await firestore()
    .collection('chat')
    .doc(`${userId}-${remoteId}`)
    .collection('messages')
    .doc(`${userId}-${remoteId}`)
    .collection('messages')
    .add(message)
}
