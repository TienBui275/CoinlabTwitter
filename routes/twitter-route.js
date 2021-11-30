const router = require('express').Router();

const { TwitterApi } = require('twitter-api-v2');

const appOnlyClient = new TwitterApi(process.env.Bearer_Token);
const roClient = appOnlyClient.readOnly;



router.get('/liked', async (req, res, next) => {
  try {
    

    const username = req.query.inpuName;
    console.log(req.query.inpuName);
    const userID = await roClient.v2.userByUsername(username);

    const likedTweets = await roClient.v2.userLikedTweets(userID.data.id);

    //await likedTweets.fetchNext();

    res.send( likedTweets.data);
  } catch (error) {
    console.log(error.message)
    next(error)
  }

});

router.get('/usertimeline', async (req, res, next) => {

  const username = req.query.username;
//3317859984
  const userID = await roClient.v2.userByUsername(username);

  const tweetsOfUser = await roClient.v2.userTimeline(userID.data.id, { exclude: 'replies' });

  res.send({ message:   tweetsOfUser.data});
});

module.exports = router;
