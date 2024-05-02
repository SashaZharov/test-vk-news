import { FC, useEffect, useState } from "react";
import {
  Group,
  Header,
  Link,
  MiniInfoCell,
  NavIdProps,
  Panel,
  PanelHeader,
  PanelHeaderBack,
  ScreenSpinner,
  Text,
} from "@vkontakte/vkui";
import { useParams, useRouteNavigator } from "@vkontakte/vk-mini-apps-router";
import { getStory } from "../../../shared/api/story";
import {
  RawComment,
  Story,
  Comment as CommentType,
} from "../../../shared/api/types";

import {
  Icon24ExternalLinkOutline,
  Icon24User,
  Icon24RecentOutline,
} from "@vkontakte/icons";

import { getComment } from "../../../shared/api/comments";
import { formatDate } from "../../../shared/utils";
import { Comment } from "../../../entities/comments";
import styles from "./styles.module.css"

export const News: FC<NavIdProps> = ({ id }) => {
  const params = useParams<"storyId">()!;
  const routeNavigator = useRouteNavigator();
  const [story, setStory] = useState<Story>();
  const [comments, setComments] = useState<CommentType[]>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const storyId = Number(params.storyId);
    const loadStory = () => {
      if (!storyId) return;

      getStory(storyId)
        .then((rawStory) => {
          if (!rawStory) return;
          const formattedTime = formatDate(rawStory.time);
          const story: Story = {
            ...rawStory,
            time: formattedTime,
          };
          setStory(story);

          if (rawStory.kids && rawStory.kids.length > 0) {
            return Promise.all(rawStory.kids.map((id) => getComment(id))).then(
              (commentsRawData) => {
                const existingComments = commentsRawData.filter((comment) =>
                  Boolean(comment)
                ) as RawComment[];
                const sortedComments = existingComments.sort(
                  (timeA, timeB) => timeB.time - timeA.time
                ) as unknown as CommentType[];
                setComments(sortedComments);
              }
            );
          }
        })
        .catch((error) => {
          console.error("Failed to fetch story or comments", error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    };

    loadStory();
  }, [params.storyId]);

  return (
    <Panel id={id}>
      <PanelHeader
        before={<PanelHeaderBack onClick={() => routeNavigator.back()} />}
      >
        {isLoading ? "Загрузка..." : story?.title}
      </PanelHeader>
      {isLoading ? (
        <ScreenSpinner size="large" />
      ) : (
        <>
          <Group>
            <Text weight="1" className={styles.Story__Title}>
              {story?.title ? story.title : "Без названия"}
            </Text>
            {story?.by && (
              <MiniInfoCell before={<Icon24User />}>{story.by}</MiniInfoCell>
            )}
            {story?.url && (
              <MiniInfoCell before={<Icon24ExternalLinkOutline />}>
                <Link href={story.url} target="_blank">
                  {story.url}
                </Link>
              </MiniInfoCell>
            )}
            {story?.time && (
              <MiniInfoCell before={<Icon24RecentOutline />}>
                {story.time}
              </MiniInfoCell>
            )}
          </Group>
          <Group
            header={
              <Header mode="secondary">{`Комментарии: ${
                story?.kids ? story?.kids.length : 0
              }`}</Header>
            }
          >
            {comments?.map((item) => (
              <Comment key={item.id} {...item} />
            ))}
          </Group>
        </>
      )}
    </Panel>
  );
};
