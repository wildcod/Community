import * as React from 'react'
import Svg, { Path } from 'react-native-svg'

function Search(props) {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      stroke="currentColor"
      fill="currentColor"
      strokeWidth={1}
      strokeLinecap="round"
      strokeLinejoin="round"
      width={24}
      height={24}
      {...props}
    >
      <Path d="M9 2C5.146 2 2 5.146 2 9s3.146 7 7 7a6.959 6.959 0 0 0 4.574-1.719l.426.426V16l6 6 2-2-6-6h-1.293l-.426-.426A6.959 6.959 0 0 0 16 9c0-3.854-3.146-7-7-7zm0 2c2.773 0 5 2.227 5 5s-2.227 5-5 5-5-2.227-5-5 2.227-5 5-5z" />
    </Svg>
  )
}

export default Search
