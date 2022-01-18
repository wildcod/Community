import { useTheme } from '@react-navigation/native'
import React, { useEffect, useState } from 'react'
import {
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native'
import { AuthContext } from '../context/authContext'
import instanceAxios from '../utils/fetcher'
import CreateRoom from './CreateRoom'
import { Friends, Home, Plus, PlusSquare, User } from './icons/index'

function TabBar({ state, descriptors, navigation }) {
  const { authState } = React.useContext(AuthContext)
  const { colors } = useTheme()
  const [showCreateRoom, setShowCreateRoom] = useState(false)
  const [rooms, setRooms] = useState([])

  useEffect(() => {
    getRoomsData()
  }, [])

  const getRoomsData = async () => {
    if (!authState.userInfo || !authState.userInfo.rooms || !authState.userInfo.rooms.length) return
    const response = await instanceAxios.get(
      `rooms/avatar?ids=${authState.userInfo.rooms.join(',')}`
    )
    const data = await response.data
    if (data.status === 'error') return
    setRooms(data.avatars)
  }

  const createRoomButton = () => (
    <TouchableOpacity
      onPress={() => setShowCreateRoom(true)}
      style={[styles.avatar, { backgroundColor: colors.primary }]}
    >
      <Plus color="#fff" />
    </TouchableOpacity>
  )

  const renderItem = ({ item }) => (
    <TouchableWithoutFeedback>
      <View>
        <Image style={styles.avatar} source={{ uri: item.avatar }} />
      </View>
    </TouchableWithoutFeedback>
  )

  return (
    <View style={{ height: 75 }}>
      <CreateRoom visible={showCreateRoom} setVisible={setShowCreateRoom} />
      <FlatList
        style={[styles.list, { backgroundColor: colors.bgColor }]}
        data={rooms}
        horizontal
        keyExtractor={(item, index) => index.toString()}
        ListHeaderComponent={createRoomButton}
        contentContainerStyle={{ alignSelf: 'center' }}
        renderItem={renderItem}
      />
      <View
        style={[
          styles.tabBarContainer,
          { backgroundColor: colors.bgColor, borderColor: colors.border }
        ]}
      >
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key]
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name

          const isFocused = state.index === index

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true
            })

            if (!isFocused && !event.defaultPrevented) {
              if (authState.token) {
                navigation.navigate(route.name, {
                  username: authState.userInfo.username
                })
              } else {
                navigation.navigate('SignModal')
              }
            }
          }

          return (
            <TouchableOpacity key={route.key} onPress={onPress} style={styles.button}>
              {label === 'Home' && <Home color={isFocused ? colors.blue : colors.text} />}
              {label === 'Friends' && <Friends color={isFocused ? colors.blue : colors.text} />}
              {label === 'CreatePost' && (
                <PlusSquare color={isFocused ? colors.blue : colors.text} />
              )}
              {label === 'User' && <User color={isFocused ? colors.blue : colors.text} />}
            </TouchableOpacity>
          )
        })}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  tabBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    borderTopWidth: 1
  },
  button: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 5
  },
  list: {
    width: '100%',
    height: 50
  },
  avatar: {
    height: 25,
    width: 25,
    borderRadius: 25 / 2,
    marginHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center'
  }
})

export default TabBar
