const Room = require('../models/room');
const User = require('../models/user');

exports.create = async (req, res) => {
  try {
    const data = await req.body;
    const room = await Room.create(data.room);
    const user = await User.findById(data.userId);
    user.rooms ? user.rooms.push(room._id) : (user.rooms = [room._id]);
    await user.save();
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

exports.getRoomAvatars = async (req, res) => {
  try {
    const { ids } = await req.query;
    const idsArray = ids.split(',');
    console.log('getting rooms ', idsArray);
    const avatars = await Room.find({ _id: { $in: idsArray } }, 'avatar');
    console.log('avatars', avatars);
    res.send({ avatars, status: 'success' });
  } catch (error) {
    return res.status(400).json({
      status: 'error',
      message: 'Something went wrong.'
    });
  }
};
