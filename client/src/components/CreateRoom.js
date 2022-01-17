import { useTheme } from '@react-navigation/native'
import React, { useState } from 'react'
import { View, Text, Modal, StyleSheet } from 'react-native'
import ImagePicker from 'react-native-image-crop-picker'

const _topics = []
for (var i = 0; i < 7; i++) _topics.push('')

export default function CreateRoom({ visible, setVisible }) {
  const { colors } = useTheme()
  const [name, setName] = useState('')
  const [avatar, setAvatar] = useState('')
  const [topics, setTopics] = useState(_topics)

  const handleCreateRoom = async () => {}

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      style={[styles.modal, { backgroundColor: colors.background }]}
    />
  )
}

const styles = StyleSheet.create({
  modal: {
    flex: 1
  }
})
