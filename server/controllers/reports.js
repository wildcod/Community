const Report = require('../models/report');
const User = require('../models/user');

exports.createReport = async (req, res) => {
  try {
    const { postId, userId, reason } = await req.body;
    const report = new Report({ postId, userId, reason });
    const user = await User.findById(userId);
    user.reports ? user.reports.push(postId) : [(user.reports = [postId])];
    await user.save();
    await report.save();
    return res.send({
      status: 'success',
      message: 'Reported successfully',
      user
    });
  } catch (error) {
    return res.status(400).json({
      status: 'error',
      message: 'Something went wrong.'
    });
  }
};
