import { useTheme } from '@react-navigation/native'
import React from 'react'
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native'
import { AuthContext } from '../context/authContext'
import { Friends, Home, Plus, PlusSquare, User } from './icons/index'

function TabBar({ state, descriptors, navigation }) {
  const { authState } = React.useContext(AuthContext)
  const { colors } = useTheme()

  const createRoomButton = () => (
    <TouchableOpacity style={[styles.avatar, { backgroundColor: colors.primary }]}>
      <Plus color="#fff" />
    </TouchableOpacity>
  )

  return (
    <View style={{ height: '15%' }}>
      <FlatList
        style={[styles.list, { backgroundColor: colors.bgColor }]}
        data={[]}
        horizontal
        keyExtractor={item => item}
        ListHeaderComponent={createRoomButton}
        contentContainerStyle={{ alignSelf: 'center' }}
        // renderItem={({ item }) => (
        //   <TouchableOpacity
        //     onPress={() => (onClick ? onClick(item) : setFieldValue('category', item))}
        //   >
        //     <Text
        //       style={[
        //         styles.category,
        //         {
        //           fontWeight: item === selectedCategory ? 'bold' : 'normal',
        //           borderBottomColor: item === selectedCategory ? colors.blue : 'transparent',
        //           color: item === selectedCategory ? colors.blue : colors.text
        //         }
        //       ]}
        //     >
        //       {item}
        //     </Text>
        //   </TouchableOpacity>
        // )}
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
