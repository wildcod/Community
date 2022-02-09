const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reportModel = new Schema({
  postId: { type: String, required: true },
  userId: { type: String, required: true },
  reason: { type: String, required: true }
});

reportModel.set('toJSON', { getters: true });
reportModel.options.toJSON.transform = (doc, ret) => {
  const obj = { ...ret };
  delete obj._id;
  delete obj.__v;
  return obj;
};

module.exports = mongoose.model('Report', reportModel);
