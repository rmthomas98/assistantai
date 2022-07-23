const Twitter = require("twitter");
import axios from "axios";
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

    const client = new Twitter({
      consumer_key: process.env.TWITTER_CLIENT_ID,
      consumer_secret: process.env.TWITTER_CLIENT_SECRET,
      access_token_key: oauth_token,
      access_token_secret: oauth_token_secret,
    });

    let tweetId;
    if (tweets.length > 1) {
      client.post(
        "statuses/update",
        { status: tweets[0] },
        (error, tweet, response) => {
          if (error) return res.status(500).send("Server Error");
          // console.log(tweet); // Tweet body.
          // console.log(response); // Raw response object.
          tweetId = tweet.id_str;

          const tweetsList = tweets.filter((tweet, i) => i > 0);
          tweetsList.forEach((tweetText) => {
            client.post("statuses/update", {
              status: tweetText,
              in_reply_to_status_id: tweetId,
            });
          });
        }
      );
      res.send("success");
    } else {
      const tweet = tweets[0];

      client.post(
        "statuses/update",
        { status: tweet },
        (error, tweet, response) => {
          if (error) return res.status(500).send("Server Error");
          res.send("success");
        }
      );
    }
  } catch {
    res.status(500).send("Server Error");
  }
};

export default handler;
