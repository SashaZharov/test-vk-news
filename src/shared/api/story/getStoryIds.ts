import { fetchData } from "../../utils";
import { STORIES_URL } from "../config";

export const getStoryIds = async (): Promise<number[] | undefined> => {
  return fetchData<number[]>(STORIES_URL);
};
