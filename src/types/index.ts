interface Video {
  title: string;
  play_url: string;
  cover: string;
}

interface VideoItemProps {
  video: Video;
  isActive: boolean;
  isSwipe: boolean;
}

interface ListBlockProps {
  tabIndex: number;
  fetchData: FetchDataProps[];
  activeIndex: number;
  tabType: TabType;
  isSwipe: boolean;
  setActiveVideo: (currentSlide: number) => void;
}

interface FetchDataProps {
  title: string;
  play_url: string;
  cover: string;
}

interface ActiveVedioIndexProps {
  forYou: number;
  following: number;
}

export enum TabType {
  follow = 1,
  forYou = 2,
}

export type {
  Video,
  VideoItemProps,
  ListBlockProps,
  FetchDataProps,
  ActiveVedioIndexProps,
};
