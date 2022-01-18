const Room = require('../models/room');

exports.create = async (req, res) => {
  try {
    const data = await req.body;
    const room = await Room.create(data);
    res.send({
      status: 'success',
      message: 'Created room successfully',
      data: room
    });
  } catch (error) {
    return res.status(400).json({
      status: 'error',
      message: 'Something went wrong.'
    });
  }
};
