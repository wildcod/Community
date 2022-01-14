import { useTheme } from '@react-navigation/native'
import React, { useContext, useLayoutEffect, useState } from 'react'
import { FlatList, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import styles from './styles'
import { AuthContext } from '../../../context/authContext'
import axios from '../../../utils/fetcher'

export default function List({ users, navigation }) {
  const renderItem = ({ item }) => <Tile navigation={navigation} item={item} />

  return (
    <FlatList
      style={styles.list}
      data={users}
      renderItem={renderItem}
      keyExtractor={(item, index) => index.toString()}
    />
  )
}

const Tile = ({ item, navigation }) => {
  const { colors } = useTheme()
  const { authState } = useContext(AuthContext)
  const [isFollowing, setIsFollowing] = useState(false)
  const [isRequested, setIsRequested] = useState(false)

  useLayoutEffect(() => {
    item.requests && item.requests.indexOf(authState.userInfo.id) !== -1 && setIsRequested(true)
    if (authState.userInfo.followers) {
      authState.userInfo.followers.indexOf(item.id) !== -1 && setIsFollowing(true)
    }
  }, [])

  const handleOnPress = () => {
    if (isFollowing) handleUnfollow()
    else handleRequest()
  }

  const handleUnfollow = async () => {
    const response = await axios.post(
      `/user/unfollow?userId=${authState.userInfo.id}&userToUnfollowId=${item.id}`
    )
  }

  const handleRequest = async () => {
    setIsRequested(true)
    const response = await axios.post(
      `/user/request?userId=${authState.userInfo.id}&userToFollowId=${item.id}`
    )
    const data = await response.data
    console.log('response', data)
  }

  const handleNavigate = async () => {
    navigation.navigate('Chat', { remoteUser: item })
  }

  return item.id === authState.userInfo.id ? (
    <></>
  ) : (
    <TouchableWithoutFeedback onPress={handleNavigate}>
      <View style={[styles.tile]}>
        <Text style={{ color: colors.text, fontSize: 18 }}>{item.username}</Text>
        <TouchableOpacity disabled={isRequested} onPress={handleOnPress}>
          <Text style={{ color: colors.primary }}>
            {isFollowing ? 'Unfollow' : isRequested ? 'Requested' : 'Request'}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  )
}
