const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const blockModel = new Schema({
  usersBlocked: { type: Array, required: true },
  userId: { type: String, required: true }
});

blockModel.set('toJSON', { getters: true });
blockModel.options.toJSON.transform = (doc, ret) => {
  const obj = { ...ret };
  delete obj._id;
  delete obj.__v;
  return obj;
};

module.exports = mongoose.model('Block', blockModel);
