import { fetchData } from "../utils";
import { ITEM_URL } from "../config";
import { RawStory } from "../types";

export const getStory = async (storyId: number): Promise<RawStory | null> => {
  return fetchData<RawStory>(`${ITEM_URL}${storyId}.json`);
};
