import { Dimensions, StyleSheet } from 'react-native'
const { width, height } = Dimensions.get('screen')

export default StyleSheet.create({
  screen: {
    flex: 1
  },
  input: {
    width,
    height: height * 0.075,
    paddingHorizontal: 15,
    fontSize: 16,
    borderBottomColor: 'rgb(55,55,55)',
    borderBottomWidth: 1
  },
  list: {
    flex: 1
  },
  tile: {
    width,
    height: height * 0.075,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 25
  }
})
