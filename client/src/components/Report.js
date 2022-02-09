import { View, Text, TextInput, StyleSheet, Dimensions, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import Modal from 'react-native-modal'
import { useTheme } from '@react-navigation/native'
import Button from './Button'
import instanceAxios from '../utils/fetcher'
import { AuthContext } from '../context/authContext'
const { height, width } = Dimensions.get('screen')

export default function Report({ visible, setVisible }) {
  const { colors } = useTheme()
  const { authState } = React.useContext(AuthContext)
  const [reason, setReason] = useState('')

  const [isLoading, setIsLoading] = useState(false)

  const handleReport = async () => {
    setIsLoading(true)
    const payload = {}
    const response = await instanceAxios.post('report')
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
