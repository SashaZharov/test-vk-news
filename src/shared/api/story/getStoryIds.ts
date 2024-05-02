import { fetchData } from "../utils";
import { NEW_STORIES_URL } from "../config";

export const getStoryIds = async (): Promise<number[] | null> => {
  return fetchData<number[]>(NEW_STORIES_URL);
};
