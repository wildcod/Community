import { useTheme } from '@react-navigation/native'
import React from 'react'
import { Text, TextInput, TouchableOpacity, View } from 'react-native'
import styles from './styles'

export default function Input({ value, onChangeText, showFriends }) {
  const { colors } = useTheme()
  return (
    <View style={{ justifyContent: 'center' }}>
      <TextInput
        placeholder="Enter a username here..."
        placeholderTextColor="grey"
        style={[styles.input, { backgroundColor: colors.bgColor, color: colors.text }]}
        value={value}
        onChangeText={onChangeText}
      />
      <TouchableOpacity
        style={{
          position: 'absolute',
          right: 15
        }}
        onPress={showFriends}
      >
        <Text style={{ color: colors.primary }}>Show Friends</Text>
      </TouchableOpacity>
    </View>
  )
}
