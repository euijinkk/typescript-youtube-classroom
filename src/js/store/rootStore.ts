let currentObserver: any = null;

export const setCurrentObserver = (observer: any) => {
  currentObserver = observer;
};

// @index signature
const observable = <T extends { [prop: string]: any }>(target: T): T => {
  Object.keys(target).forEach(key => {
    const observers: any = {};
    let cache = target[key];

    Object.defineProperty(target, key, {
      get() {
        if (currentObserver) {
          observers[currentObserver.constructor.name] = currentObserver;
        }

        return cache;
      },
      set(value) {
        cache = value;
        Object.keys(observers).map(key => observers[key].render());
      },
    });
  });

  return target;
};

export const rootStore = {
  state: observable<stateInterface>({
    isSearchModalOpened: false,
    isLoading: false,
    searchOption: {
      query: '',
      pageToken: null,
    },
    videos: [],
    savedVideos: [],
    hasWatchedVideo: false,
    hasWatchingVideo: false,
    status: {
      notFound: false,
      statusCode: 200,
    },
  }),
  setState<T>(newState: T) {
    Object.entries(newState).forEach(([key, value]) => {
      if (!Object.prototype.hasOwnProperty.call(this.state, key)) return;

      this.state[key] = value;
    });
  },
};

interface stateInterface {
  isSearchModalOpened: boolean;
  isLoading: boolean;
  searchOption: {
    query: string;
    pageToken: string | null;
  };
  videos: videoInterface[];
  savedVideos: savedVideo[];
  hasWatchedVideo: boolean;
  hasWatchingVideo: boolean;
  status: {
    notFound: boolean;
    statusCode: number;
  };
  [prop: string]: any;
}

interface videoInterface {
  videoId: string;
  thumbnailUrl: string;
  title: string;
  channelTitle: string;
  publishTime: string;
}

type savedVideo = videoInterface & { watched: boolean };
