import AwesomeDebouncePromise from 'awesome-debounce-promise'
import React, { useState } from 'react'
import { View } from 'react-native'
import axios from '../../../../utils/fetcher'
import Input from './components/Input'
import List from './components/List'
import styles from './components/styles'

export default function({ navigation }) {
  const [query, setQuery] = useState('')
  const [users, setUsers] = useState([])

  const onChangeText = e => {
    setQuery(e)
    if (e.length === 0) return
    const asyncFunctionDebounced = AwesomeDebouncePromise(() => handleSearch(e), 500)
    asyncFunctionDebounced()
  }

  const handleSearch = async e => {
    const response = await axios.get(`user/search/${e}`)
    const data = await response.data
    setUsers(data.users)
  }

  return (
    <View style={styles.screen}>
      <Input value={query} onChangeText={onChangeText} />
      <List users={users} navigation={navigation} />
    </View>
  )
}
