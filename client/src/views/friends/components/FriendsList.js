import AsyncStorage from '@react-native-community/async-storage'
import { useTheme } from '@react-navigation/native'
import React, { useContext, useEffect, useState } from 'react'
import { FlatList, RefreshControl, Text, TouchableWithoutFeedback, View } from 'react-native'
import { AuthContext } from '../../../context/authContext'
import axios from '../../../utils/fetcher'
import styles from './styles'

export default function({ navigation }) {
  const { colors } = useTheme()
  const { authState, setAuthState } = useContext(AuthContext)
  const [friends, setFriends] = useState([])
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    handleGetData()
  }, [])

  const handleGetData = async () => {
    if (!authState.userInfo.friends || !authState.userInfo.friends.length) return
    const response = await axios.get(`users?ids=${authState.userInfo.friends}`)
    const data = await response.data
    if (data.status === 'success') setFriends(data.users)
  }

  const renderItem = ({ item }) => (
    <>
      <View style={styles.friendTile}>
        <Text style={[styles.friendName, { color: colors.text }]}>{item.username}</Text>

        <TouchableWithoutFeedback onPress={() => navigation.navigate('Chat', { remoteUser: item })}>
          <View style={[styles.friendRequestTileButton, { backgroundColor: colors.primary }]}>
            <Text style={[styles.friendName, { color: '#fff' }]}>Message</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
      <View style={styles.seperator} />
    </>
  )

  const onRefresh = async () => {
    setRefreshing(true)
    const response = await axios.get(`user/${authState.userInfo.id}`)
    const data = await response.data
    setAuthState({ ...authState, userInfo: data.user })
    await AsyncStorage.setItem('userInfo', JSON.stringify(data.user))
    setRefreshing(false)
  }

  const refreshControl = <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />

  return (
    <>
      <Text style={[styles.heading, { color: colors.text }]}>Friends</Text>
      <FlatList
        refreshControl={refreshControl}
        data={friends}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
      />
    </>
  )
}
