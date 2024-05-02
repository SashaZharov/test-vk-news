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
import { RawComment, Story } from "../../../shared/api/types";
import {
  Icon24ExternalLinkOutline,
  Icon24User,
  Icon24RecentOutline,
} from "@vkontakte/icons";

import { getComment } from "../../../shared/api/comments";
import { decodeHtml, formatDate } from "../../../shared/utils";

export const News: FC<NavIdProps> = ({ id }) => {
  const params = useParams<"storyId">()!;
  const routeNavigator = useRouteNavigator();
  const [story, setStory] = useState<Story>();
  const [comments, setComments] = useState<Comment[]>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const storyId = params.storyId;
    const fetchData = async () => {
      try {
        if (storyId) {
          const rawStory = await getStory(Number(storyId));

          if (rawStory) {
            if (rawStory.kids && rawStory.kids.length > 0) {
              const promises = rawStory.kids.map((commentId) =>
                getComment(commentId)
              );
              const commentsRawData = (await Promise.all(promises)).filter(
                Boolean
              ) as RawComment[];
              const nonNullComments = commentsRawData
                .sort((a, b) => b.time - a.time)
                .map((comment) => ({
                  ...comment,
                  text: decodeHtml(comment.text),
                  time: formatDate(comment.time),
                })) as unknown as Comment[];
              setComments(nonNullComments);
            }
            const formattedTime = formatDate(rawStory.time);
            const story: Story = {
              ...rawStory,
              time: formattedTime,
            };
            setStory(story);
          }
        }
      } catch (error) {
        console.error("Failed to fetch story or comments", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
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
            <Text weight="1" style={{ fontSize: 20, padding: 12 }}>
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
              <Header mode="secondary">{`Comments: ${
                story?.kids ? story?.kids.length : 0
              }`}</Header>
            }
          >
            {/* Comments */}
          </Group>
        </>
      )}
    </Panel>
  );
};
