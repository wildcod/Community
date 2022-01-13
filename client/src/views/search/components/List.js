import { useTheme } from '@react-navigation/native'
import React from 'react'
import { FlatList, Text, TouchableOpacity, View } from 'react-native'
import styles from './styles'

export default function List({ users }) {
  const { colors } = useTheme()

  const renderItem = ({ item }) => (
    <View style={[styles.tile]}>
      <Text style={{ color: colors.text, fontSize: 18 }}>{item.username}</Text>
      <TouchableOpacity>
        <Text style={{ color: colors.primary }}>Follow</Text>
      </TouchableOpacity>
    </View>
  )

  return (
    <FlatList
      style={styles.list}
      data={users}
      renderItem={renderItem}
      keyExtractor={(item, index) => index.toString()}
    />
  )
}
