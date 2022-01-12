import React from 'react'
import { Composer, InputToolbar } from 'react-native-gifted-chat'

export const renderComposer = (props, color, backgroundColor) => (
  <Composer {...props} textInputStyle={{ color, backgroundColor }} />
)

export const renderInputToolbar = (props, backgroundColor) => (
  <InputToolbar
    {...props}
    containerStyle={{
      backgroundColor,
      padding: 0,
      borderWidth: 0,
      elevation: 0,
      shadowOpacity: 0,
      margin: 0
    }}
    primaryStyle={{
      alignItems: 'center'
    }}
  />
)
