import { View, Text, TextInput, StyleSheet, Dimensions, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import Modal from 'react-native-modal'
import { useTheme } from '@react-navigation/native'
import Button from '../components/Button'
import instanceAxios from '../utils/fetcher'
import { AuthContext } from '../context/authContext'
import AsyncStorage from '@react-native-community/async-storage'
const { height, width } = Dimensions.get('screen')

export default function Block({ visible, setVisible, userId, setOuterVisible, navigation }) {
  const { colors } = useTheme()
  const { authState, setAuthState } = React.useContext(AuthContext)

  const [isLoading, setIsLoading] = useState(false)

  const handleBlock = async () => {
    setIsLoading(true)
    const payload = {
      userId: authState.userInfo.id,
      userToBlockId: userId
    }
    const response = await instanceAxios.post('block', payload)
    const data = await response.data
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
      <Text style={[styles.text, { color: colors.text }]}>Are you sure?</Text>
      <View style={{ flexDirection: 'row', marginTop: 15 }}>
        <Button onPress={handleBlock} title="Yes" bgColor={colors.primary}>
          {isLoading && <ActivityIndicator size="small" color="white" />}
        </Button>
      </View>
      <View style={{ flexDirection: 'row' }}>
        <Button onPress={() => setVisible(false)} title="No" bgColor={colors.primary} />
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
