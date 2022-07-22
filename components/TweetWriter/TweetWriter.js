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
  Loading,
} from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import {
  TbFeather,
  TbPlus,
  TbTrash,
  TbRobot,
  TbRotateClockwise2,
} from "react-icons/tb";
import axios from "axios";
import { TweetModal } from "../TweetModal/TweetModal";

export const TweetWriter = ({ tweets, setTweets }) => {
  const { data: session, status: currentStatus } = useSession();
  const { isDark } = useTheme();

  const [index, setIndex] = useState(0);
  const [completionLoading, setCompletionLoading] = useState(false);
  const [summarizeLoading, setSummarizeLoading] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [filteredTweets, setFilteredTweets] = useState(false);

  const handleInputValue = (e) => {
    console.log(e.key);
    const tweetsCopy = [...tweets];
    tweetsCopy[index] = e.target.value;
    setTweets(tweetsCopy);
  };

  const handleAddTweet = () => {
    if (tweets[index] === "") return;
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

  const handleCompletion = async () => {
    if (tweets[0].length < 1) return;
    setCompletionLoading(true);
    const response = await axios.post("/api/complete", {
      text: tweets.join(""),
    });
    const tweetsCopy = [...tweets];
    tweetsCopy[index] += response.data.choices[0].text;
    setTweets(tweetsCopy);
    setCompletionLoading(false);
  };

  const handleSummarize = async () => {
    if (tweets[index].length < 1) return;
    setSummarizeLoading(true);
    const response = await axios.post("/api/summarize", {
      text: tweets[index],
    });
    const tweetsCopy = [...tweets];
    tweetsCopy[index] = response.data.choices[0].text.split("\n").join("");
    setTweets(tweetsCopy);
    setSummarizeLoading(false);
  };

  useEffect(() => {
    const filterTweets = tweets.filter((tweet) => tweet !== "");
    setFilteredTweets(filterTweets);
  }, []);

  const handleFilteredTweets = () => {
    if (tweets[0] === "") return;
    const filterTweets = tweets.filter((tweet) => tweet !== "");
    setFilteredTweets(filterTweets);
    setIsActive(true);
  };

  if (currentStatus === "loading") return <div></div>;

  return (
    <>
      <TweetModal
        filteredTweets={filteredTweets}
        isActive={isActive}
        setIsActive={setIsActive}
      />
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
                color={
                  tweets[index].length > 280
                    ? "error"
                    : tweets[index].length > 260
                    ? "warning"
                    : "success"
                }
                status={
                  tweets[index].length > 280
                    ? "error"
                    : tweets[index].length > 260
                    ? "warning"
                    : "success"
                }
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
                  onClick={handleFilteredTweets}
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
                    icon={completionLoading ? null : <TbRobot />}
                    disabled={completionLoading}
                    css={{ maxWidth: "32px !important", width: 32 }}
                    onClick={handleCompletion}
                  >
                    {completionLoading ? (
                      <Loading size="xs" css={{ position: "absolute" }} />
                    ) : null}
                  </Button>
                </Tooltip>
                <Spacer x={0.4} />
                <Tooltip
                  content="AI Rewriter"
                  placement="bottom"
                  color="invert"
                  offset={20}
                >
                  <Button
                    auto
                    size="sm"
                    shadow
                    color="primary"
                    icon={summarizeLoading ? null : <TbRotateClockwise2 />}
                    onClick={handleSummarize}
                    disabled={summarizeLoading}
                  >
                    {summarizeLoading ? (
                      <Loading size="xs" css={{ position: "absolute" }} />
                    ) : null}
                  </Button>
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
                    disabled={tweets[tweets.length - 1] === ""}
                  />
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
                  />
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
                  <Card.Header
                    css={{ p: "$8", justifyContent: "space-between" }}
                  >
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
    </>
  );
};
