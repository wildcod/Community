const User = require('../models/user');

exports.blockUser = async (req, res) => {
  try {
    const { userId, userToBlockId } = await req.query;
    const user = await User.findById(userId);
    user.blocks
      ? user.blocks.push(userToBlockId)
      : (user.blocks = [userToBlockId]);
    await user.save();
    return res.send({
      status: 'success',
      message: 'User blocked successfully',
      user
    });
  } catch (error) {
    return res.status(400).json({
      status: 'error',
      message: 'Something went wrong.'
    });
  }
};
