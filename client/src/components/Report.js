import { View, Text, TextInput, StyleSheet, Dimensions, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import Modal from 'react-native-modal'
import { useTheme } from '@react-navigation/native'
import Button from './Button'
import instanceAxios from '../utils/fetcher'
import { AuthContext } from '../context/authContext'
import AsyncStorage from '@react-native-community/async-storage'
const { height, width } = Dimensions.get('screen')

export default function Report({ visible, setVisible, postId, setOuterVisible, navigation }) {
  const { colors } = useTheme()
  const { authState, setAuthState } = React.useContext(AuthContext)
  const [reason, setReason] = useState('')

  const [isLoading, setIsLoading] = useState(false)

  const handleReport = async () => {
    setIsLoading(true)
    const payload = { reason, userId: authState.userInfo.id, postId }
    const response = await instanceAxios.post('report', payload)
    const data = await response.data
    if (data.status === 'error') return
    const _user = data.user
    setIsLoading(false)
    setVisible(false)
    setOuterVisible(false)
    navigation.goBack()
    setAuthState({ ...authState, userInfo: _user })
    await AsyncStorage.setItem('userInfo', JSON.stringify(_user))
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
    >
      <Text style={[styles.text, { color: colors.text }]}>Tell us why this is inapproriate?</Text>
      <TextInput
        placeholder="Type here..."
        placeholderTextColor="grey"
        value={reason}
        multiline
        onChangeText={e => setReason(e)}
        style={styles.input}
      />
      <View style={{ flexDirection: 'row', marginTop: 15 }}>
        <Button onPress={handleReport} title="Report" bgColor={colors.primary}>
          {isLoading && <ActivityIndicator size="small" color="white" />}
        </Button>
      </View>
      <View style={{ flexDirection: 'row' }}>
        <Button onPress={() => setVisible(false)} title="Cancel" bgColor={colors.primary} />
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
