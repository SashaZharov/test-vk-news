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

  return (
    <CardGrid
      key={id}
      size="l"
      onClick={() => routeNavigator.push(`/news/${id}`)}
    >
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
