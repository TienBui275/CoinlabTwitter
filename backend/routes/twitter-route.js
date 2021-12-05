const router = require('express').Router();
const { TwitterApi } = require('twitter-api-v2');

const shiller = ["satusatunya", "TomiJava", "charlaterr", "SenenaHuang", "senenaw", "NgHanCarlos"]
//,Leona975,JerryWill95,Lilas_Maison,JouneVio,eddy_tilley,lynnet999,GreenPaul3011,Taunyavv2tu3,Jesko_999,Gemera_999,CryptoDream33,zAmeliaYoungz,AdamSUN1234,TonySun1234,Trannam36999,emeliab2may,Trannam36999,henk_wahyu,hougasogsoohoo1,tukoato,MacusPeter,anhthuong167,keisao1313,thanhtrung8998,thanhtrung9889,brendol6,paijho96,DonnyTommy0507,Leonardanfagn1y,Bob_cryptotrend,Angela_ima21,riihinn,AyuNur48342664,liu_mathe,ikristyv8,Hamanda1610,longpham_220799,longlongg220799,LightShine12,_bylnn,nth1510,Khoadinh18,tonynguyensky,chaunga9,DannyL97329,dannyl29397,Jason512nx,Jason_nx512,hieudox,dustin336699,taylor00123456,celi6789,mrlucky30062019,mrhappy_happy,palo001234,PhRabbit123,Mira199912"

const appOnlyClient = new TwitterApi(process.env.Bearer_Token);
const userClient = new TwitterApi({
  appKey: process.env.TWITTER_CONSUMER_KEY,
  appSecret: process.env.TWITTER_CONSUMER_SECRET,
  accessToken: process.env.TWITTER_ACCESS_TOKEN,
  accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
});

const roClient = appOnlyClient.readOnly;
const rwClient = appOnlyClient.readWrite;
//const kols = ["DannyL97329", "CamgelinaHaha", "acari2705", "mrhot285", "Hannie_155", "Vanluna99", "luuphulam", "Dewis05", "Mira06869", "abdulqadir_ibn", "Cronald81", "daisy_binance", "Willzitj", "KZGmalik", "Darcy21814809", "JasonTonyCali", "BArt_sticker", "Immthi3ns0n", "CoinLAB_Offi", "CoinLAB_GG", "MiaoYing94"]

const kols = ["DannyL97329", "CamgelinaHaha", "acari2705"]
const kolsData = {}
async function createKolsData() {

  for (let i = 0; i < kols.length; i++) {
    const userInfo = await roClient.v2.userByUsername(kols[i]);
    kolsData[userInfo.data.id] = { name: userInfo.data.name, username: userInfo.data.username }
    //kolsDataArr.push({id: userInfo.data.id, name: userInfo.data.name})
  }

}

router.get('/kols', async (req, res) => {

  kolsDataArr = []

  for (let i = 0; i < kols.length; i++) {
    const userInfo = await roClient.v2.userByUsername(kols[i]);
    kolsDataArr.push({ id: userInfo.data.id, name: userInfo.data.name })
  }

  res.send(kolsDataArr)
})

const startDate = new Date(2021, 11, 4, 00, 00, 00, 0);

router.get('/kolstimeline', async (req, res) => {

  kolsTimeline = []

  for (let i = 0; i < kols.length; i++) {

    const userInfo = await roClient.v2.userByUsername(kols[i]);
    

    const tweetsOfUser = await roClient.v2.userTimeline(
      userInfo.data.id,
      {
        exclude: 'retweets,replies',
        expansions: 'author_id',
        start_time: startDate.toISOString(),
        "tweet.fields": 'entities'

      });



    const timelineData = tweetsOfUser.data.data
    for (let i = 0; i < timelineData.length; i++) {
      if (parseInt(userInfo.data.id) == parseInt(timelineData[i].author_id)) {

        kolsTimeline.push(
          {
            id: timelineData[i].id,
            author_id: timelineData[i].author_id,
            url: timelineData[i].entities.urls[0].url,
            text: timelineData[i].text,
            name: userInfo.data.name

          })
      }
    }

  }

  res.send(kolsTimeline)
})

router.get('/shillertimeline', async (req, res) => {

  shillerTimeline = []

  const username = req.query.username;
  const userInfo = await roClient.v2.userByUsername(username);

  const tweetsOfUser = await roClient.v2.userTimeline(
    userInfo.data.id,
    {
      exclude: 'replies',
      expansions: 'author_id,referenced_tweets.id',
      start_time: startDate.toISOString(),
      "tweet.fields": 'entities'
    });

  const timelineData = tweetsOfUser.data.data

  for (let i = 0; i < timelineData.length; i++) {
    if (timelineData[i].referenced_tweets) {
      if (timelineData[i].referenced_tweets[0].type === 'retweeted') {
        shillerTimeline.push({
          id : timelineData[i].referenced_tweets[0].id,
          //url : timelineData[i].entities.urls[0].url
        })
      
        
      }
    }
  }

  res.send(shillerTimeline)
})

// get time line , exclude: 'retweets,replies' => chi con lai nhung tweet ma minh post
const getUserTimelineExcluded = async (req, res, next) => {
  const username = req.query.username;
  //console.log('z next', next)
  const userID = await roClient.v2.userByUsername(username);

  //Date(year, month, day, hours, minutes, seconds, milliseconds) month:0-11
  const d = new Date(2021, 11, 3, 10, 00, 00, 0);

  const tweetsOfUser = await roClient.v2.userTimeline(userID.data.id,
    {
      exclude: 'replies',
      start_time: d.toISOString(),
      expansions: 'author_id,referenced_tweets.id',
      "tweet.fields": 'entities'
    });

  res.status(200).send(tweetsOfUser.data.data)
}

//const allTweetofKOL = []


async function countAllTweetKOL() {

  const allTweetofKOL = []

  for (let i = 0; i < kols.length; i++) {
    const user = await roClient.v2.userByUsername(kols[i]);
    //console.log('z countAllTweetKOL user.data.id', user.data.id)

    const startDate = new Date(2021, 11, 3, 10, 00, 00, 0);

    const tweetsOfUser = await roClient.v2.userTimeline(
      user.data.id,
      {
        exclude: 'retweets,replies',
        expansions: 'author_id',
        start_time: startDate.toISOString(),
        "tweet.fields": 'entities'

      });

    for await (const tweet of tweetsOfUser) {
      if (user.data.id == tweet.author_id) {
        allTweetofKOL.push(
          {
            id: tweet.id,
            author_id: tweet.author_id,
            url: tweet.entities.urls.url,
            text: tweet.text,
          })
      }
    }
  }

  return allTweetofKOL

}

//countAllTweetKOL()

async function countTweetShiller(userName) {
  //await countAllTweetKOL()
  console.log('z countTweetShiller', allTweetofKOL.length)

  ret_count = 0
  const user = await roClient.v2.userByUsername(userName);
  const tweetsOfUser = await roClient.v2.userTimeline(user.data.id, { exclude: 'replies', expansions: 'author_id,referenced_tweets.id' });
  for await (const tweet of tweetsOfUser) {
    //console.log('z referenced_tweets' , tweet)
    if (tweet.referenced_tweets) {
      if (tweet.referenced_tweets[0].type === 'retweeted') {
        //console.log('z referenced_tweets' , tweet)
        if (allTweetofKOL.includes(tweet.referenced_tweets[0].id)) {
          ret_count++;
        }
      }
    }
  }


  console.log('z countTweetShiller: ', ret_count)
}

//countTweetShiller(shiller[0])


router.get('/countretweet', async (req, res, next) => {
  //console.log('z test ' , shiller);
  //id = 889153519785189378
  const username = req.query.username;
  console.log('z test ', username);
  const userID = await roClient.v2.userByUsername(username);




  res.send(userID);
});


router.get('/liked', async (req, res, next) => {
  try {


    const username = req.query.inpuName;
    console.log(req.query.inpuName);
    const userID = await roClient.v2.userByUsername(username);

    const likedTweets = await roClient.v2.userLikedTweets(userID.data.id);

    //await likedTweets.fetchNext();

    res.send(likedTweets.data);
  } catch (error) {
    console.log(error.message)
    next(error)
  }

});

router.get('/usertimeline', getUserTimelineExcluded);

module.exports = router;
