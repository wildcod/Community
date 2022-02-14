import React from 'react'
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  TouchableOpacity,
  KeyboardAvoidingView,
  ActivityIndicator,
  Image
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTheme } from '@react-navigation/native'

import axios from '../utils/fetcher'
import { Formik } from 'formik'
import * as Yup from 'yup'

import Button from '../components/Button'
import { AuthContext } from '../context/authContext'

import ImagePicker from 'react-native-image-crop-picker'
import { Plus } from '../components/icons'
import uploadImage from '../utils/uploadImage'
import { fcmService } from '../utils/FCMService'

const SignUp = ({ navigation }) => {
  const { setStorage } = React.useContext(AuthContext)
  const { colors } = useTheme()
  const [isLoading, setIsLoading] = React.useState(false)
  const [avatar, setAvatar] = React.useState(undefined)
  const [avatarError, setAvatarError] = React.useState(null)

  const handleImage = () => {
    try {
      ImagePicker.openPicker({
        width: 550,
        height: 550,
        cropping: true,
        multiple: false
      }).then(async image => {
        setAvatar(image.path)
      })
    } catch (err) {
      console.log('error picking images', err)
    }
  }

  const onSubmit = async (values, { setStatus, resetForm }) => {
    try {
      if (!avatar) setAvatarError('Please choose a profile image')
      const uploadImageResponse = await uploadImage(avatar)
      if (uploadImageResponse.err) return err
      const fcmToken = await fcmService.getToken()
      const { data } = await axios.post('signup', {
        ...values,
        avatar: uploadImageResponse.url,
        fcmToken
      })
      const { token, expiresAt, userInfo } = data

      setStorage(token, expiresAt, userInfo)
      navigation.navigate('Home')
      resetForm({})
    } catch (error) {
      setStatus(error.response.data.message)
    }
  }

  return (
    <Formik
      initialValues={{ username: '', password: '', passwordConfirmation: '' }}
      onSubmit={onSubmit}
      validationSchema={Yup.object({
        username: Yup.string()
          .required('Required')
          .max(32, 'Must be at most 32 characters long')
          .matches(/^[a-zA-Z0-9_-]+$/, 'Contains invalid characters'),
        password: Yup.string()
          .required('Required')
          .min(6, 'Must be at least 6 characters long')
          .max(50, 'Must be at most 50 characters long'),
        passwordConfirmation: Yup.string().oneOf(
          [Yup.ref('password'), null],
          'Passwords must match'
        )
      })}
    >
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        touched,
        errors,
        status,
        values,
        setTouched
      }) => (
        <KeyboardAvoidingView
          behavior="padding"
          style={{ flex: 1, backgroundColor: colors.background }}
        >
          <TouchableWithoutFeedback onPress={() => navigation.goBack()}>
            <View as={SafeAreaView} style={styles.container}>
              <View
                style={[styles.modal, { backgroundColor: colors.background }]}
                onStartShouldSetResponder={() => true}
                onResponderRelease={() => setTouched(errors)}
              >
                <TouchableOpacity
                  onPress={() => navigation.goBack()}
                  style={{ position: 'absolute', right: 15, top: 15, zIndex: 1000 }}
                >
                  <Text style={{ color: colors.primary }}>Close</Text>
                </TouchableOpacity>

                <TouchableWithoutFeedback onPress={handleImage}>
                  <View
                    style={{
                      width: 75,
                      height: 75,
                      borderRadius: 75 / 2,
                      marginTop: -30,
                      backgroundColor: colors.bgColor,
                      alignItems: 'center',
                      justifyContent: 'center',
                      alignSelf: 'center'
                    }}
                  >
                    {avatar ? (
                      <Image
                        style={{ width: 75, height: 75, borderRadius: 75 / 2 }}
                        source={{ uri: avatar }}
                      />
                    ) : (
                      <Plus color={colors.text} />
                    )}
                  </View>
                </TouchableWithoutFeedback>
                {avatarError && (
                  <Text style={[styles.errorMessage, { textAlign: 'center' }]}>{avatarError}</Text>
                )}
                {!!status && <Text style={styles.status}>{status}</Text>}
                {touched.username && errors.username && (
                  <Text style={styles.errorMessage}>{errors.username}</Text>
                )}
                <TextInput
                  style={[
                    styles.textInput,
                    touched.username && errors.username && { borderColor: colors.red },
                    { color: colors.text }
                  ]}
                  placeholder="Username"
                  placeholderTextColor={colors.text}
                  value={values.username}
                  onChangeText={handleChange('username')}
                  onBlur={handleBlur('username')}
                />
                {touched.password && errors.password && (
                  <Text style={styles.errorMessage}>{errors.password}</Text>
                )}
                <TextInput
                  style={[
                    styles.textInput,
                    touched.password && errors.password && { borderColor: colors.red },
                    { color: colors.text }
                  ]}
                  placeholder="Password"
                  placeholderTextColor={colors.text}
                  value={values.password}
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  secureTextEntry
                />
                {touched.passwordConfirmation && errors.passwordConfirmation && (
                  <Text style={styles.errorMessage}>{errors.passwordConfirmation}</Text>
                )}
                <TextInput
                  style={[
                    styles.textInput,
                    touched.passwordConfirmation &&
                      errors.passwordConfirmation && {
                        borderColor: colors.red
                      },
                    { color: colors.text }
                  ]}
                  placeholder="Confirm Password"
                  placeholderTextColor={colors.text}
                  value={values.passwordConfirmation}
                  onChangeText={handleChange('passwordConfirmation')}
                  onBlur={handleBlur('passwordConfirmation')}
                  secureTextEntry
                />
                <View style={styles.buttonContainer}>
                  <Button
                    onPress={handleSubmit}
                    title="Create Account"
                    bgColor={colors.signUpButton}
                  >
                    {isLoading && <ActivityIndicator size="small" color="white" />}
                  </Button>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      )}
    </Formik>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end'
  },
  modal: {
    padding: 16,
    width: '100%',
    height: '100%',
    borderRadius: 6,
    elevation: 6,
    justifyContent: 'center'
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#9f9f9f',
    height: 50,
    borderRadius: 10,
    margin: 10,
    paddingLeft: 20
  },
  errorMessage: {
    color: 'red',
    marginHorizontal: 10,
    fontWeight: 'bold',
    fontSize: 15
  },
  buttonContainer: {
    flexDirection: 'row'
  },
  status: {
    color: 'red',
    marginVertical: 15,
    fontWeight: 'bold',
    fontSize: 15,
    textAlign: 'center'
  }
})

export default SignUp
