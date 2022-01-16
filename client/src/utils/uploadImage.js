const {
  DO_SPACES_ENDPOINT,
  DO_SPACES_REGION,
  DO_SPACES_BUCKET,
  DO_SPACES_PREFIX,
  DO_SPACES_KEY,
  DO_SPACES_SECRET
} = process.env
import { RNS3 } from 'react-native-aws3'

export default async uri => {
  try {
    const extension = uri.split('.').slice(-1)[0]
    const fileName = `${Math.random()
      .toString(36)
      .substring(2, 9) +
      '-' +
      Math.random()
        .toString(36)
        .substring(2, 9)}.${extension}`
    const response = await RNS3.put(
      {
        uri,
        name: fileName,
        type: `image/${extension}`
      },
      {
        awsUrl: DO_SPACES_ENDPOINT,
        bucket: DO_SPACES_BUCKET,
        region: DO_SPACES_REGION,
        accessKey: DO_SPACES_KEY,
        secretKey: DO_SPACES_SECRET,
        successActionStatus: 201
      }
    )
    console.log('uploadImage resposne', response)
    if (response.status === 201) {
      return { url: 'https://' + response.body.postResponse.location }
    }
  } catch (err) {
    return { err }
  }
}
