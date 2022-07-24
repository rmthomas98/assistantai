import styles from "./Nav.module.css";
import {
  User,
  Text,
  Switch,
  useTheme,
  Dropdown,
  Divider,
} from "@nextui-org/react";
import { useSession, signOut } from "next-auth/react";
import { BsFillSunFill, BsFillMoonStarsFill } from "react-icons/bs";
import { useTheme as useNextTheme } from "next-themes";
import { useEffect } from "react";
import { BiChat, BiExit } from "react-icons/bi";
import { useWindowWidth } from "@react-hook/window-size";

export const Nav = () => {
  const { data: session, status } = useSession();
  const { setTheme } = useNextTheme();
  const { isDark } = useTheme();
  const width = useWindowWidth();

  useEffect(() => {
    if (isDark) {
      document.querySelector("body")?.classList.add("my-dark-app");
    } else {
      document.querySelector("body")?.classList.remove("my-dark-app");
    }
  }, [isDark]);

  const handleDropDownAction = (key) => {
    if (key === "log-out") signOut();
  };

  if (status === "loading") return <div></div>;

  return (
    <div
      className={styles.wrapper}
      style={{
        background: isDark ? "#00000042" : "#ffffff42",
        borderBottom: isDark ? "1px solid #26292b" : "1px solid #ecedee",
      }}
    >
      <div className={styles.container}>
        <Text h3 weight="semibold" css={{ m: "$0" }}>
          AssistantAI
        </Text>
        <div className={styles.rightContainer}>
          <Switch
            css={{ mr: "$10" }}
            size="sm"
            shadow
            iconOn={<BsFillMoonStarsFill />}
            iconOff={<BsFillSunFill />}
            checked={isDark}
            onChange={(e) =>
              e.target.checked ? setTheme("dark") : setTheme("light")
            }
          />
          <Dropdown placement="bottom-right">
            <Dropdown.Trigger>
              <User
                as="button"
                src={session.user.image}
                squared
                bordered
                pointer
                color="gradient"
                name={width > 600 ? session.user.name : null}
              />
            </Dropdown.Trigger>
            <Dropdown.Menu
              onAction={handleDropDownAction}
              variant="shadow"
              aria-label="dropdown actions"
            >
              {/* <Dropdown.Item key="profile" css={{ height: "$18" }}>
                <Text color="inherit">Signed in as</Text>
                <Text size={14} color="inhereit">
                  {session.user.name}
                </Text>
              </Dropdown.Item> */}

              <Dropdown.Item key="feedback" icon={<BiChat />}>
                Feedback
              </Dropdown.Item>
              <Dropdown.Item key="log-out" color="error" icon={<BiExit />}>
                Log out
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
    </div>
  );
};
