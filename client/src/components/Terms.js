import React, { useState } from 'react'
import WebView from 'react-native-webview'
import Modal from 'react-native-modal'
import { StyleSheet, Dimensions, Text, View, ActivityIndicator } from 'react-native'
import { useTheme } from '@react-navigation/native'
import CheckBox from '@react-native-community/checkbox'
import Button from './Button'
import AsyncStorage from '@react-native-community/async-storage'

const { width, height } = Dimensions.get('screen')

export default function Terms({ visible, setHidden }) {
  const { colors } = useTheme()
  const [toggleCheckBox, setToggleCheckBox] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleContinue = async () => {
    if (!toggleCheckBox) return
    setIsLoading(true)
    await AsyncStorage.setItem('terms', 'accepted')
    setIsLoading(false)
    setHidden(true)
  }

  return (
    <Modal isVisible={visible} style={[styles.modal, { backgroundColor: colors.card }]}>
      <WebView
        containerStyle={{ maxHeight: height * 0.5 }}
        source={{
          uri: 'https://www.freeprivacypolicy.com/live/0ddb8678-c328-4274-bed6-1c49218a5e01'
        }}
      />
      <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 15, marginTop: 25 }}>
        <CheckBox
          disabled={false}
          value={toggleCheckBox}
          onValueChange={newValue => setToggleCheckBox(newValue)}
        />
        <Text style={{ color: colors.text, marginLeft: 5 }}>I accept the Terms and Conditions</Text>
      </View>
      <View style={{ flexDirection: 'row' }}>
        <Button onPress={handleContinue} title="Continue" bgColor={colors.primary}>
          {isLoading && <ActivityIndicator size="small" color="white" />}
        </Button>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modal: {
    height: height * 0.6,
    maxHeight: height * 0.6,
    top: '20%'
  }
})
