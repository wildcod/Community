import { StyleSheet, Dimensions } from 'react-native'
const { height } = Dimensions.get('screen')

export default StyleSheet.create({
  screen: {
    flex: 1
  },
  button: {
    width: '95%',
    height: height * 0.075,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center'
  },
  tileLabel: {
    fontSize: 18
  },
  friendTile: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  friendName: {
    fontSize: 16
  },
  seperator: {
    left: 10,
    height: 0.5,
    flex: 1,
    backgroundColor: 'grey'
  },
  friendRequestTileButton: {
    paddingHorizontal: 5,
    paddingVertical: 2
  },
  heading: {
    fontSize: 30,

    marginLeft: 10,
    marginTop: 20,
    fontWeight: 'bold'
  }
})
