import React, { useState } from 'react'
import { View } from 'react-native'
import Input from './components/Input'
import styles from './components/styles'
import axios from '../../utils/fetcher'
import List from './components/List'

import AwesomeDebouncePromise from 'awesome-debounce-promise'

export default function() {
  const [query, setQuery] = useState('')
  const [users, setUsers] = useState([])

  const onChangeText = e => {
    setQuery(e)
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
      <List users={users} />
    </View>
  )
}
