import styles from "./TweetModal.module.css";
import { Modal, Text, User, Card, useTheme } from "@nextui-org/react";
import { useSession } from "next-auth/react";

export const TweetModal = ({ isActive, setIsActive, filteredTweets }) => {
  const { data: session } = useSession();
  const { isDark } = useTheme();
  console.log(filteredTweets);

  return (
    <Modal
      open={isActive}
      onClose={() => setIsActive(false)}
      css={{ py: "$8" }}
    >
      <Modal.Header>
        <Text h3>Tweet Preview</Text>
      </Modal.Header>
      <Modal.Body css={{ p: "$8" }}>
        {filteredTweets.map((tweet, i) => {
          return (
            <Card key={i} variant={isDark ? "bordered" : "flat"}>
              <Card.Header css={{ p: "$8", justifyContent: "space-between" }}>
                <User
                  css={{ pl: "$0" }}
                  src={session?.user?.image}
                  name={session?.user?.name}
                />
              </Card.Header>
              <Card.Body css={{ p: "$8", pt: "$0" }}>
                {tweet?.split("\n").map((line, i) => {
                  return (
                    <Text size={12.76} weight="medium" key={i}>
                      {line ? line : <br />}
                    </Text>
                  );
                })}
              </Card.Body>
            </Card>
          );
        })}
      </Modal.Body>
    </Modal>
  );
};
