import { View, Text, TextInput, StyleSheet, Dimensions, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import Modal from 'react-native-modal'
import { useTheme } from '@react-navigation/native'
import Button from './Button'
import instanceAxios from '../utils/fetcher'
import { AuthContext } from '../context/authContext'
const { height, width } = Dimensions.get('screen')

export default function Block({ visible, setVisible, userId, setOuterVisible }) {
  const { colors } = useTheme()
  const { authState } = React.useContext(AuthContext)
  const [reason, setReason] = useState('')

  const [isLoading, setIsLoading] = useState(false)

  const handleBlock = async () => {
    setIsLoading(true)
    const payload = { reason, userId: authState.userInfo.id, userId }
    const response = await instanceAxios.post('block', payload)
    const data = await response.data
    setIsLoading(false)
    setVisible(false)
    setOuterVisible(false)
    console.log('response data', data)
  }

  return (
    <Modal
      isVisible={visible}
      style={{
        // margin: 0,
        backgroundColor: colors.card,
        borderRadius: 15,
        paddingHorizontal: 15,
        maxHeight: height * 0.25,
        top: '35%'
      }}
      onBackdropPress={() => setVisible(false)}
    >
      <Text style={[styles.text, { color: colors.text }]}>Are you sure?</Text>
      <View style={{ flexDirection: 'row', marginTop: 15 }}>
        <Button onPress={handleBlock} title="No" bgColor={colors.primary}>
          {isLoading && <ActivityIndicator size="small" color="white" />}
        </Button>
      </View>
      <View style={{ flexDirection: 'row', marginTop: 15 }}>
        <Button onPress={handleBlock} title="Yes" bgColor={colors.primary}>
          {isLoading && <ActivityIndicator size="small" color="white" />}
        </Button>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  input: {
    // width: width * 0.5,
    minHeight: height * 0.05,
    maxHeight: height * 0.075,
    borderColor: 'grey',
    marginTop: 20,
    borderWidth: 0.5,
    borderRadius: 10,
    padding: 10
  },
  text: {}
})
