import { FC, useState, useEffect } from "react";
import {
  Panel,
  PanelHeader,
  Button,
  Group,
  Div,
  Spinner,
  NavIdProps,
  Card,
} from "@vkontakte/vkui";
import { formatDate } from "../../../shared/utils";
import { StoryCard } from "../../../entities/story";
import { StoryCardProps } from "../../../entities/story";
import { getStory, getStoryIds } from "../../../shared/api/story";
import { RawStory } from "../../../shared/api/types";
import styles from "./styles.module.css";

export const Home: FC<NavIdProps> = ({ id }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [stories, setStories] = useState<StoryCardProps[]>([]);

  const loadStories = async () => {
    setLoading(true);
    const storyIds = await getStoryIds();
    if (!storyIds) return;

    const storyPromises = storyIds
      .slice(0, 100)
      .map((storyId) => getStory(storyId));
    const storiesData = (await Promise.all(storyPromises)).filter(
      Boolean
    ) as RawStory[];

    const formattedStories = storiesData
      .sort((a, b) => b.time - a.time)
      .map((story) => {
        return {
          id: story.id,
          title: story.title,
          by: story.by,
          score: story.score,
          time: formatDate(story.time),
        };
      });

    setStories(formattedStories);
    setLoading(false);
  };

  useEffect(() => {
    loadStories();

    const intervalId = setInterval(loadStories, 60000);

    return () => clearInterval(intervalId);
  }, []);

  const handleRefresh = () => {
    loadStories();
  };

  return (
    <Panel id={id}>
      <PanelHeader>Hacker news</PanelHeader>

      <Group>
        <Div>
          <Button size="l" mode="secondary" onClick={handleRefresh}>
            Обновить
          </Button>
        </Div>

        {loading && (
          <Card mode="shadow" className={styles.Home__LoaderCard}>
            <Spinner size="large" />
          </Card>
        )}
        {stories.map((story) => (
          <StoryCard key={story.id} {...story} />
        ))}
      </Group>
    </Panel>
  );
};
