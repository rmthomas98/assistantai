const { TwitterApi } = require("twitter-api-v2");
import prisma from "../../lib/prisma";

const handler = async (req, res) => {
  try {
    const { tweets, id } = req.body;

    const user = await prisma.user.findUnique({
      where: { id },
      include: { accounts: true },
    });

    const account = user.accounts[0];
    const { oauth_token, oauth_token_secret } = account;

    const client = new TwitterApi({
      appKey: process.env.TWITTER_CLIENT_ID,
      appSecret: process.env.TWITTER_CLIENT_SECRET,
      accessToken: oauth_token,
      accessSecret: oauth_token_secret,
    });

    if (tweets.length > 1) {
      // create a thread of tweets
      await client.v1.tweetThread(tweets);
      res.send("success");
    } else {
      const tweet = tweets[0];
      await client.v1.tweet(tweet);
      res.send("success");
    }
  } catch {
    res.status(500).send("Server Error");
  }
};

export default handler;
