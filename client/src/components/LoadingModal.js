import { useTheme } from '@react-navigation/native'
import React from 'react'
import { ActivityIndicator, StyleSheet, Dimensions } from 'react-native'
const { height, width } = Dimensions.get('screen')

import Modal from 'react-native-modal'

export default function LoadingModal({ visible }) {
  const { colors } = useTheme()
  return (
    <Modal
      style={[styles.modal, { backgroundColor: colors.background }]}
      isVisible={visible}
      backdropOpacity={0.4}
      useNativeDriver={true}
      useNativeDriverForBackdrop={true}
      animationInTiming={250}
      animationOutTiming={250}
      animationIn="fadeIn"
      animationOut="fadeOut"
    >
      <ActivityIndicator color={colors.primary} size={20} />
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    height,
    width,
    alignItems: 'center',
    justifyContent: 'center'
  },
  modal: {
    alignSelf: 'center',
    height: width * 0.2,
    width: width * 0.2,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: height * 0.4,
    borderRadius: 5
  }
})
