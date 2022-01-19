const cron = require('node-cron');
const Post = require('./models/post');

// cron.schedule('* * */1 * *', async () => {
//   console.log('running a task everyday');
//   const topPost = await Post.find({ views: -1 }).limit(1);
//   console.log('top post', topPost);
// });

cron.schedule('* * */1 * *', async () => {
  Post.find({}, function (err, posts) {
    if (err || !posts.length) return;
    const topPost = posts[0];
    Post.find({}, async function (err, _posts) {
      if (err || !_posts.length) return;
      const oldestPost = _posts[0];
      topPost.title = oldestPost.category;
      await topPost.save();
    })
      .sort({ createdAt: -1 })
      .limit(1);
  })
    .sort({ views: -1 })
    .limit(1);
});
