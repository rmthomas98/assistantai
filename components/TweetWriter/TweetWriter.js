import styles from "./TweetWriter.module.css";
import {
  Textarea,
  Button,
  Card,
  User,
  Text,
  Progress,
  Spacer,
  Tooltip,
  useTheme,
} from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import {
  TbFeather,
  TbPlus,
  TbTrash,
  TbRobot,
  TbRotate360,
  TbRotateDot,
  TbRotateClockwise,
  TbRotateClockwise2,
} from "react-icons/tb";

export const TweetWriter = ({ tweets, setTweets }) => {
  const { data: session, status: currentStatus } = useSession();
  const { isDark } = useTheme();

  const [index, setIndex] = useState(0);

  const handleInputValue = (e) => {
    if (e.target.value.length >= 281) return;
    console.log(e.key);
    const tweetsCopy = [...tweets];
    tweetsCopy[index] = e.target.value;
    setTweets(tweetsCopy);
  };

  const handleAddTweet = () => {
    const tweetsCopy = [...tweets];
    tweetsCopy.push("");
    setTweets(tweetsCopy);
    setIndex(tweetsCopy.length - 1);
  };

  const handleDeleteTweet = () => {
    if (tweets.length === 1) return;
    const tweetsCopy = [...tweets];
    tweetsCopy.splice(index, 1);
    setTweets(tweetsCopy);
    setIndex(tweetsCopy.length - 1);
  };

  console.log(tweets[index]);

  if (currentStatus === "loading") return <div></div>;

  return (
    <div className={styles.container}>
      <div className={styles.tweeterContainer}>
        <div className={styles.tweeterInputContainer}>
          <Textarea
            placeholder="Start writing a tweet..."
            size="md"
            minRows={10}
            maxRows={10}
            css={{ width: "100%" }}
            aria-label="tweet"
            value={tweets[index]}
            onChange={(e) => handleInputValue(e)}
          />
          <div className={styles.progressContainer}>
            <Progress
              size="xs"
              css={{ mt: "$6", ml: "$2", mb: "$8", width: "90%" }}
              shadow
              max={280}
              value={tweets[index].length}
              color={tweets[index].length > 260 ? "error" : "success"}
              status={tweets[index].length > 260 ? "error" : "success"}
            />
            <Text
              small
              weight="semibold"
              css={{
                ml: "$6",
                display: "flex",
                justifyContent: "center",
                position: "relative",
                bottom: 1,
              }}
            >
              {tweets[index].length}
            </Text>
          </div>
          <div className={styles.actionContainer}>
            <div className={styles.leftContainer}>
              <Button
                auto
                size="sm"
                color="gradient"
                shadow
                icon={<TbFeather />}
              >
                Tweet
              </Button>
              <Spacer x={0.4} />
              <Tooltip
                content="AI Completion"
                placement="bottom"
                color="invert"
                offset={20}
              >
                <Button
                  auto
                  size="sm"
                  shadow
                  color="primary"
                  icon={<TbRobot />}
                />
              </Tooltip>
              <Spacer x={0.4} />
              <Tooltip
                content="AI Summarizer"
                placement="bottom"
                color="invert"
                offset={20}
              >
                <Button
                  auto
                  size="sm"
                  shadow
                  color="primary"
                  icon={<TbRotateClockwise2 />}
                />
              </Tooltip>
            </div>
            <div className={styles.tweeterTweetContainer}>
              <Tooltip
                content="Add Tweet (Thread)"
                placement="bottom"
                color="invert"
                offset={20}
              >
                <Button
                  icon={<TbPlus />}
                  auto
                  size="sm"
                  shadow
                  ghost
                  onClick={handleAddTweet}
                ></Button>
              </Tooltip>
              <Spacer x={0.4} />
              <Tooltip
                content="Delete Tweet"
                placement="bottom"
                color="error"
                offset={20}
              >
                <Button
                  icon={<TbTrash />}
                  auto
                  size="sm"
                  color="error"
                  shadow
                  ghost
                  disabled={tweets.length === 1}
                  onClick={handleDeleteTweet}
                ></Button>
              </Tooltip>
            </div>
          </div>
        </div>
        <Spacer />
        <div className={styles.tweetsContainer}>
          {tweets.map((tweet, i) => {
            return (
              <Card
                variant={
                  i === index && isDark
                    ? "bordered"
                    : i === index && !isDark
                    ? "shadow"
                    : "flat"
                }
                borderWeight="normal"
                className={styles.fadeIn}
                key={i}
                css={{ width: "100%", mb: "$8" }}
                isHoverable
                isPressable
                onClick={() => setIndex(i)}
                bordered
              >
                <Card.Header css={{ p: "$8", justifyContent: "space-between" }}>
                  <User
                    css={{ pl: "$0" }}
                    src={session.user.image}
                    bordered
                    color="gradient"
                    squared
                    name={session.user.name}
                  />
                  <Text span small>
                    {tweets[i].length}
                  </Text>
                </Card.Header>
                <Card.Divider />
                <Card.Body css={{ p: "$8" }}>
                  {tweets[i] !== ""
                    ? tweets[i]?.split("\n").map((line, i) => {
                        return (
                          <Text size={12.76} weight="medium" key={i}>
                            {line ? line : <br />}
                          </Text>
                        );
                      })
                    : ""}
                </Card.Body>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};
