export interface RawStory {
  by: string;
  descendants: number;
  id: number;
  kids: number[];
  score: number;
  time: number;
  title: string;
  type: string;
  url: string;
}

export interface RawComment {
  by: string;
  id: number;
  kids?: number[];
  parent: number;
  text: string;
  time: number;
  type: string;
}

export type Comment = {
  id: number;
  by: string;
  text: string;
  time: number;
  kids?: number[];
};

export type Story = {
  by: string;
  descendants: number;
  id: number;
  kids: number[];
  score: number;
  time: string;
  title: string;
  type: string;
  url: string;
};
