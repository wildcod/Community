const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userModel = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: { type: String, required: false },
  friends: { type: Array, required: false },
  requests: { type: Array, required: false },
  rooms: { type: Array, required: false },
  reports: { type: Array, required: false },
  blocks: { type: Array, required: false },
  role: { type: String, required: true, default: 'user' },
  fcmToken: { type: String }
});

userModel.set('toJSON', { getters: true });
userModel.options.toJSON.transform = (doc, ret) => {
  const obj = { ...ret };
  delete obj._id;
  delete obj.__v;
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('user', userModel);
