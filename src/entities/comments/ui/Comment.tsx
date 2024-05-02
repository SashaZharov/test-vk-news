import { FC, useState } from "react";
import { Comment as CommentType } from "../../../shared/api/types";
import { Div, Text, Caption } from "@vkontakte/vkui";
import { decodeHtml, formatDate } from "../../../shared/utils";
import { getComment } from "../../../shared/api/comments";
import styles from "./styles.module.css";

export const Comment: FC<CommentType> = ({ id, by, text, time, kids }) => {
  const [childComments, setChildComments] = useState<CommentType[]>([]);
  const [isChildCommentsVisible, setChildCommentsVisible] = useState(false);

  const handleRepliesClick = () => {
    if (!isChildCommentsVisible && kids && kids.length > 0) {
      const loadChildComments = async () => {
        const childCommentPromises = kids.map((kidId) => getComment(kidId));
        const childCommentsData = await Promise.all(childCommentPromises);
        const filteredChildCommentsData = childCommentsData.filter((comment) =>
          Boolean(comment)
        ) as unknown as CommentType[];
        setChildComments(filteredChildCommentsData);
      };

      loadChildComments();
    }

    setChildCommentsVisible(!isChildCommentsVisible);
  };

  return (
    <Div>
      <div className={styles.CommentTitle}>
        <Text weight="2" style={{ fontSize: 18 }}>
          {by || "Аноним"}
        </Text>
      </div>
      <Text style={{ fontSize: 16 }}>
        {decodeHtml(text !== undefined ? text : "")}
      </Text>
      <Caption
        className={styles.Comment__Caption}
        onClick={handleRepliesClick}
      >
        {kids && kids.length ? `Ответы: ${kids.length} ` : "Нет ответов"}
        {" • "}
        {formatDate(time)}
      </Caption>
      {isChildCommentsVisible &&
        childComments.map((item) => <Comment key={item.id} {...item} />)}
    </Div>
  );
};
