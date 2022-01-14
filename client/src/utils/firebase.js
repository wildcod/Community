import firestore from '@react-native-firebase/firestore'

export const getChatMessages = async id => {
  const snapshot = await firestore()
    .collection('chat')
    .doc(id)
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

export const updateMessages = async (id, message) => {
  return await firestore()
    .collection('chat')
    .doc(id)
    .collection('messages')
    .add(message)
}
