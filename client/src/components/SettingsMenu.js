import { useTheme } from '@react-navigation/native'
import React, { useState } from 'react'
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native'
import Modal from 'react-native-modal'
import { Settings } from './icons'
import Report from './Report'

export default function SettingsMenu({ postId, navigation }) {
  const { colors } = useTheme()
  const [visible, setVisible] = useState(false)
  const [showReportMenu, setShowReportMenu] = useState(false)

  const hideMenu = () => setVisible(false)

  const showMenu = () => setVisible(true)

  const handleReport = () => {
    setVisible(false)
    setShowReportMenu(true)
  }

  return (
    <View>
      <Report
        navigation={navigation}
        visible={showReportMenu}
        setOuterVisible={setVisible}
        setVisible={setShowReportMenu}
        postId={postId}
      />
      <Modal
        isVisible={visible}
        style={{
          margin: 0,
          position: 'absolute',
          bottom: 0,
          backgroundColor: colors.card,
          //   height: height * 0.1,
          paddingVertical: 15,
          borderTopRightRadius: 15,
          borderTopLeftRadius: 15,
          width: '100%'
        }}
        onDismiss={() => setVisible(false)}
        onBackdropPress={() => setVisible(false)}
      >
        <View style={[styles.modal]}>
          <TouchableWithoutFeedback onPress={handleReport}>
            <View style={styles.tile}>
              <Text style={[styles.text, { color: colors.text }]}>Report</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </Modal>

      <TouchableOpacity onPress={showMenu}>
        <Settings fill={colors.primary} />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  modal: {
    // flex: 1,
    width: '100%',
    alignSelf: 'center'
    // top: '90%'
    // bottom: 0
  },
  text: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  tile: {
    // height: height * 0.1,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'grey'
  }
})
