import React, { useContext, useEffect } from 'react'
import { StyleSheet, View, FlatList, Text, StatusBar, Linking } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTheme } from '@react-navigation/native'

import axios from '../utils/fetcher'
import { AuthContext } from '../context/authContext'
import { ThemeContext } from '../context/themeSwichContext'

import CategoryPicker from '../components/CategoryPicker'
import Post from '../components/Post'
import PostLoader from '../components/PostLoader'
import CategoryLoader from '../components/CategoryLoader'
import JoinRoom from '../components/JoinRoom'
import { RoomContext } from '../context/roomContext'
import instanceAxios from '../utils/fetcher'
import messaging from '@react-native-firebase/messaging'

const Home = ({ navigation }) => {
  const { authState } = useContext(AuthContext)
  const { theme } = useContext(ThemeContext)
  const { colors } = useTheme()
  const { activeRoom } = useContext(RoomContext)
  const [postData, setPostData] = React.useState(null)
  const [category, setCategory] = React.useState('all')
  const [isLoading, setIsLoaading] = React.useState(false)
  const [showJoinRoom, setShowJoinRoom] = React.useState(false)

  useEffect(() => {
    checkNotification()
  }, [])

  const checkNotification = async () => {
    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log('onNotificationOpenedApp', remoteMessage)
      const { data } = remoteMessage
      const { type, remoteUser } = data
      const remoteUserJson = JSON.parse(remoteUser)
      console.log('remoteUserJson', remoteUserJson)
      switch (type) {
        case 'message':
          return navigation.navigate('Chat', { remoteUser: remoteUserJson })
      }
    })
  }

  const getPostData = React.useCallback(async () => {
    setIsLoaading(true)
    const { data } = await axios.get(
      !category || category === 'all' ? 'posts' : `posts/${category}`
    )
    setPostData(data)
    setIsLoaading(false)
  }, [category])

  useEffect(() => {
    if (activeRoom) handleActiveRoomPosts()
    else getPostData()
  }, [activeRoom])

  const handleActiveRoomPosts = async () => {
    console.log('getting room posts', activeRoom)
    const response = await instanceAxios.get(`room/posts/${activeRoom.id}`)
    const responseData = await response.data
    console.log('responseData', responseData)
    if (responseData.status === 'error') return
    setPostData(responseData.data)
  }

  React.useEffect(() => {
    if (!activeRoom) getPostData()
  }, [getPostData])

  React.useEffect(() => {
    Linking.getInitialURL().then(url => {
      if (url) {
        const type = url.split('/').length > 2 && url.split('/').slice(-2)[0]
        const id = url.split('/').slice(-1)[0]
        if (type === 'invite') {
          if (authState && authState.userInfo && authState.userInfo.rooms.indexOf(id) !== -1) return
          setShowJoinRoom(true)
        }
      }
    })
  }, [])

  const onRefresh = () => {
    if (activeRoom) handleActiveRoomPosts()
    else getPostData()
  }

  return (
    <View as={SafeAreaView} style={styles.container}>
      <StatusBar
        barStyle={theme === 'light' ? 'dark-content' : 'light-content'}
        backgroundColor={colors.background}
      />
      {showJoinRoom && <JoinRoom visible={showJoinRoom} setVisible={setShowJoinRoom} />}
      {postData ? (
        <FlatList
          data={postData}
          extraData={isLoading}
          refreshing={isLoading}
          onRefresh={onRefresh}
          keyExtractor={item => item.id}
          ListHeaderComponent={
            <CategoryPicker selectedCategory={category} onClick={setCategory} addAll />
          }
          ListHeaderComponentStyle={[styles.categoryPicker, { backgroundColor: colors.bgColor }]}
          ListEmptyComponent={
            <Text style={[styles.empty, { color: colors.text }]}>Ups! Not found any post!</Text>
          }
          renderItem={({ item, index }) =>
            (authState && authState.userInfo && authState.userInfo.reports && authState.userInfo.reports.indexOf(item.id) !== -1) ||
            (authState && authState.userInfo && authState.userInfo.blocks &&
              authState.userInfo.blocks.indexOf(item.author.id) !== -1) ? (
              <></>
            ) : (
              <Post
                index={index}
                swap={item.swap}
                postId={item.id}
                userId={authState && authState.userInfo && authState.userInfo.id}
                score={item.score}
                type={item.type}
                title={item.title}
                author={item.author}
                category={item.category}
                text={item.text}
                comments={item.comments}
                created={item.created}
                url={item.url}
                votes={item.votes}
                views={item.views}
                setIsLoaading={setIsLoaading}
                setData={setPostData}
                deleteButton={false}
              />
            )
          }
        />
      ) : (
        <>
          <CategoryLoader />
          {[1, 2, 3, 4, 5].map(i => (
            <PostLoader key={i} />
          ))}
        </>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  categoryPicker: {
    padding: 5,
    marginVertical: 7,
    elevation: 3
  },
  empty: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 50,
    fontSize: 22
  }
})

export default Home
