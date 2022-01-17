const AWS_REGION = 'us-east-1'
const AWS_BUCKET = 'community-app-images'
const AWS_ACCESS_KEY = 'AKIASXXDMP7SJS4EC65I'
const AWS_SECRET = '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'

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
        bucket: AWS_BUCKET,
        region: AWS_REGION,
        accessKey: AWS_ACCESS_KEY,
        secretKey: AWS_SECRET,
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
