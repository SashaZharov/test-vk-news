import { FC } from "react";
import { Comment as CommentType } from "../../../shared/api/types";
import { Div } from "@vkontakte/vkui";

export const Comment: FC<CommentType> = ({ id, by, text, time, kids }) => {
  return <Div>{id}</Div>;
};
