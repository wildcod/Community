const Block = require('../models/block');

exports.blockUser = async (req, res) => {
  try {
    const { userId, userToBlockId } = await req.query;
    const block = await Block.findOne({ userId });
    block.blockedUsers
      ? block.blockedUsers.push(userToBlockId)
      : (block.blockedUsers = [userToBlockId]);
    await block.save();
    return res.send({
      status: 'success',
      message: 'User blocked successfully'
    });
  } catch (error) {
    return res.status(400).json({
      status: 'error',
      message: 'Something went wrong.'
    });
  }
};
