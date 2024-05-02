import { fetchData } from "../utils";
import { ITEM_URL } from "../config";
import { RawComment } from "../types";

export const getComment = async (
  commentId: number
): Promise<RawComment | null> => {
  return fetchData(`${ITEM_URL}${commentId}.json`);
};
