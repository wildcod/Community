import { useTheme } from '@react-navigation/native'
import React from 'react'
import { TextInput } from 'react-native'
import styles from './styles'

export default function Input({ value, onChangeText }) {
  const { colors } = useTheme()
  return (
    <TextInput
      placeholder="Enter a username here..."
      placeholderTextColor="grey"
      style={[styles.input, { backgroundColor: colors.card, color: colors.text }]}
      value={value}
      onChangeText={onChangeText}
    />
  )
}
