const cron = require('node-cron');
const Post = require('./models/post');
const Room = require('./models/room');
const sortArray = require('sort-array');

cron.schedule('* * */1 * *', async () => {
  const posts = await Post.aggregate([
    {
      $addFields: { noOfVotes: { $size: '$votes' } }
    },
    {
      $match: { swap: true }
    },
    {
      $sort: { noOfVotes: -1 }
    },
    {
      $limit: 1
    }
  ]);
  if (!posts.length) return;
  const topPost = posts[0];
  let oldestCategory;
  if (topPost.inRoom) {
    const room = await Room.findById(topPost.inRoom);
    oldestCategory = await getOldestCategory(room.topics);
  } else {
    oldestCategory = await getOldestCategory([
      'music',
      'funny',
      'videos',
      'programming',
      'news',
      'fashion'
    ]);
  }
  const post = await Post.findById(topPost._id);
  post.title = oldestCategory;
  await post.save();
});

const getOldestCategory = async (topics) => {
  let _posts = [];
  for (var i = 0; i < topics.length; i++) {
    await Post.find({ category: topics[i] }, (err, posts) => {
      const post = posts[0];
      _posts.push(post);
    })
      .sort({ createdAt: -1 })
      .limit(1);
  }

  const sortedPosts = sortArray(_posts, { by: 'created', order: 'desc' });
  return sortedPosts[0].category;
};
