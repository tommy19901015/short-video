import React, { useState, useEffect } from "react";
import { useSwipeable } from "react-swipeable";
import { FetchDataProps, TabType } from "./types";
import { ListBlock } from "./components/ListBlock";

const App: React.FC = () => {
  const [activeFllowingIndex, setActiveFllowingIndex] = useState<number>(0);
  const [activeForYouIndex, setActiveForYouIndex] = useState<number>(0);
  const [followingList, setFollowingList] = useState<FetchDataProps[]>([]);
  const [forYouList, setForYouList] = useState<FetchDataProps[]>([]);
  const [tabIndex, setTabIndex] = useState<number>(1);
  const [isSwipe, setIsSwipe] = useState<boolean>(false);

  useEffect(() => {
    fetchData("http://localhost:4000/for_you_list", setForYouList);
    fetchData("http://localhost:4000/following_list", setFollowingList);
  }, []);

  const fetchData = (
    url: string,
    successCallback: (items: FetchDataProps[]) => void
  ) => {
    fetch(url, {
      method: "GET",
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res: { items: FetchDataProps[] }) => {
        successCallback(res.items);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const setActiveVideo = (index: number) => {
    tabIndex === 1
      ? setActiveFllowingIndex(index)
      : setActiveForYouIndex(index);
  };

  const changeTab = (index: number) => {
    setTabIndex(index);
  };

  const handlerSwipeable = useSwipeable({
    onSwipeStart: (e) => {
      if (e.dir === "Up" || e.dir === "Down") setIsSwipe(true);
    },
    onSwiped: () => {
      setIsSwipe(false);
    },
  });

  return (
    <div {...handlerSwipeable} className="video-list">
      <div className="tabBlock">
        <div
          className={`text ${tabIndex === TabType.follow ? "active" : ""}`}
          onClick={() => changeTab(TabType.follow)}
        >
          Following
        </div>
        <div
          className={`text ${tabIndex === TabType.forYou ? "active" : ""}`}
          onClick={() => changeTab(TabType.forYou)}
        >
          For You
        </div>
      </div>
      <ListBlock
        tabIndex={tabIndex}
        fetchData={followingList}
        activeIndex={activeFllowingIndex}
        tabType={TabType.follow}
        setActiveVideo={setActiveVideo}
        isSwipe={isSwipe}
      />
      <ListBlock
        tabIndex={tabIndex}
        fetchData={forYouList}
        activeIndex={activeForYouIndex}
        tabType={TabType.forYou}
        setActiveVideo={setActiveVideo}
        isSwipe={isSwipe}
      />
    </div>
  );
};

export default App;
