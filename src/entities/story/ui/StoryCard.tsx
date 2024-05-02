import { useRouteNavigator } from "@vkontakte/vk-mini-apps-router";
import { CardGrid, ContentCard } from "@vkontakte/vkui";
import type { FC } from "react";
import styles from "./styles.module.css";
import { StoryCardProps } from "../types";

export const StoryCard: FC<StoryCardProps> = ({
  id,
  title,
  by,
  time,
  score,
}) => {
  const routeNavigator = useRouteNavigator();
  const handleClick = () => routeNavigator.push(`/news/${id}`);
  return (
    <CardGrid key={id} size="l" onClick={handleClick}>
      <ContentCard
        className={styles.Story__Card}
        header={title}
        subtitle={time}
        text={`By ${by}`}
        caption={`Score: ${score}`}
      />
    </CardGrid>
  );
};
