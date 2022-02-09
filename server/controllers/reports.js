const Report = require('../models/report');

exports.createReport = async (req, res) => {
  try {
    const { postId, userId, reason } = await req.body;
    const report = new Report({ postId, userId, reason });
    await report.save();
    return res.send({ status: 'success', message: 'Reported successfully' });
  } catch (error) {
    return res.status(400).json({
      status: 'error',
      message: 'Something went wrong.'
    });
  }
};
