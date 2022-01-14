const User = require('../models/user');
const jwtDecode = require('jwt-decode');
const { body, validationResult } = require('express-validator');

const {
  createToken,
  hashPassword,
  verifyPassword
} = require('../utils/authentication');

exports.signup = async (req, res) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    const errors = result.array({ onlyFirstError: true });
    return res.status(422).json({ errors });
  }

  try {
    const { username } = req.body;

    const hashedPassword = await hashPassword(req.body.password);

    const userData = {
      username: username.toLowerCase(),
      password: hashedPassword
    };

    const existingUsername = await User.findOne({
      username: userData.username
    }).lean();

    if (existingUsername) {
      return res.status(400).json({
        message: 'Username already exists.'
      });
    }

    const newUser = new User(userData);
    const savedUser = await newUser.save();

    if (savedUser) {
      const token = createToken(savedUser);
      const decodedToken = jwtDecode(token);
      const expiresAt = decodedToken.exp;

      const { username, role, id } = savedUser;
      const userInfo = {
        username,
        role,
        id
      };

      return res.json({
        message: 'User created!',
        token,
        userInfo,
        expiresAt
      });
    } else {
      return res.status(400).json({
        message: 'There was a problem creating your account.'
      });
    }
  } catch (error) {
    return res.status(400).json({
      message: 'There was a problem creating your account.'
    });
  }
};

exports.authenticate = async (req, res) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    const errors = result.array({ onlyFirstError: true });
    return res.status(422).json({ errors });
  }
  try {
    const { username, password } = req.body;
    const user = await User.findOne({
      username: username.toLowerCase()
    });

    console.log('user', user);

    if (!user) {
      return res.status(403).json({
        message: 'Wrong username or password.'
      });
    }

    const passwordValid = await verifyPassword(password, user.password);

    if (passwordValid) {
      const token = createToken(user);
      const decodedToken = jwtDecode(token);
      const expiresAt = decodedToken.exp;
      // const { username, role, id } = user;
      // const userInfo = { username, role, id };

      res.json({
        message: 'Authentication successful!',
        token,
        userInfo: user,
        expiresAt
      });
    } else {
      res.status(403).json({
        message: 'Wrong username or password.'
      });
    }
  } catch (error) {
    return res.status(400).json({
      message: 'Something went wrong.'
    });
  }
};

exports.search = async (req, res) => {
  try {
    const { q } = req.params;
    const users = await User.find({ username: { $regex: new RegExp(q) } });
    res.send({ users });
  } catch (err) {
    return res.status(400).json({
      message: 'Something went wrong.'
    });
  }
};

exports.sendFriendRequest = async (req, res) => {
  try {
    const { userId, userToFriendId } = await req.query;
    console.log('userId', userId, userToFriendId);
    const user = await User.findById(userToFriendId);
    console.log('fond user', user);
    if (!user)
      return res.status(403).json({
        message: 'User not found'
      });
    user.requests ? user.requests.push(userId) : (user.requests = [userId]);
    console.log('user after request', user);
    await user.save();
    return res.json({
      message: 'Follow request sent',
      status: 'success'
    });
  } catch (error) {
    return res.status(400).json({
      message: 'Something went wrong.'
    });
  }
};

exports.declineRequest = async (req, res) => {
  try {
    const { userId, userToDeclineId } = await req.query;
    const user = await User.findById(userId);
    if (!user)
      return res.status(403).json({
        message: 'User not found'
      });
    const index = user.requests.findIndex((id) => id === userToDeclineId);
    user.requests.splice(index, 1);
    await user.save();
    return res.json({
      message: 'Follow request sent',
      user
    });
  } catch (error) {
    return res.status(400).json({
      message: 'Something went wrong.'
    });
  }
};

exports.acceptRequest = async (req, res) => {
  try {
    const { userId, userToAcceptId } = await req.query;
    const user = await User.findById(userId);
    const remoteUser = await User.findById(userToAcceptId);
    if (!user)
      return res.status(403).json({
        message: 'User not found'
      });
    const index = user.requests.findIndex((id) => id === userToAcceptId);
    user.requests.splice(index, 1);
    user.followers
      ? user.followers.push(userToAcceptId)
      : (user.followers = [userToAcceptId]);
    remoteUser.following
      ? remoteUser.following.push(userToFollowId)
      : (remoteUser.following = [userToFollowId]);
    await user.save();
    await remoteUser.save();
    return res.json({
      message: 'Follow request sent',
      user
    });
  } catch (error) {
    return res.status(400).json({
      message: 'Something went wrong.'
    });
  }
};

exports.unfriend = async (req, res) => {
  try {
    const { userId, userToUnfriendId } = await req.query;
    const remoteUser = await User.findById(userToUnfriendId);
    const localUser = await User.findById(userId);
    if (!remoteUser)
      return res.status(403).json({
        message: 'User to follow not found'
      });
    if (!localUser)
      return res.status(403).json({
        message: 'User not found'
      });

    const remoteIndex = remoteUser.followers.findIndex((id) => id === userId);
    remoteUser.followers.splice(remoteIndex, 1);

    const localIndex = remoteUser.followers.findIndex(
      (id) => id === userToUnfriendId
    );
    localUser.following.splice(localIndex, 1);
    await localUser.save();
    await remoteUser.save();
    return res.json({
      message: 'User followed successfully',
      user: localUser
    });
  } catch (error) {
    return res.status(400).json({
      message: 'Something went wrong.'
    });
  }
};

exports.getUser = async (req, res) => {
  try {
    const { id } = await req.params;
    const user = await User.findById(id);
    if (!user)
      return res.status(403).json({
        message: 'User not found'
      });
    return res.json({
      user
    });
  } catch (error) {
    return res.status(400).json({
      message: 'Something went wrong.'
    });
  }
};

exports.getRequests = async (req, res) => {
  try {
    const { ids } = await req.query;
    const users = await User.find({ _id: { $in: ids } });
    console.log('users', users);
  } catch (error) {
    return res.status(400).json({
      message: 'Something went wrong.'
    });
  }
};

exports.validate = [
  body('username')
    .exists()
    .trim()
    .withMessage('is required')

    .notEmpty()
    .withMessage('cannot be blank')

    .isLength({ max: 32 })
    .withMessage('must be at most 32 characters long')

    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage('contains invalid characters'),

  body('password')
    .exists()
    .trim()
    .withMessage('is required')

    .notEmpty()
    .withMessage('cannot be blank')

    .isLength({ min: 6 })
    .withMessage('must be at least 6 characters long')

    .isLength({ max: 50 })
    .withMessage('must be at most 50 characters long')
];
