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

exports.getRoom = async (req, res) => {
  try {
    const { id } = await req.params;

    const room = await Room.findById(id);
    if (!room)
      return res.status(403).json({
        message: 'Room not found'
      });
    return res.send({
      data: room,
      status: 'success'
    });
  } catch (error) {
    return res.status(400).json({
      status: 'error',
      message: 'Something went wrong.'
    });
  }
};

exports.joinRoom = async (req, res) => {
  try {
    const { userId, roomId } = await req.query;
    const user = await User.findById(userId);
    const room = await Room.findById(roomId);
    user.rooms ? user.rooms.push(roomId) : (user.rooms = [roomId]);
    room.members ? room.members.push(userId) : (room.members = [roomId]);
    await user.save();
    await room.save();
    return res.send({
      status: 'success',
      message: 'Joined room successfully',
      data: user
    });
  } catch (error) {
    return res.status(400).json({
      status: 'error',
      message: 'Something went wrong.'
    });
  }
};
