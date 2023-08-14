import React from "react";
import Slider, { Settings } from "react-slick";
import { ListBlockProps } from "../types";
import { VideoItem } from "../components/VideoItem";

export const ListBlock: React.FC<ListBlockProps> = React.memo(
  ({ tabIndex, fetchData, activeIndex, tabType, isSwipe, setActiveVideo }) => {
    const settings: Settings = {
      dots: false,
      infinite: false,
      slidesToShow: 1,
      slidesToScroll: 1,
      vertical: true,
      verticalSwiping: true,
      afterChange: (currentSlide) => {
        setActiveVideo(currentSlide);
      },
    };

    const LoadingBlock = () => {
      return <div className="LoadingBlock">Loading Data</div>;
    };

    return (
      <div className={`listBlock ${tabIndex === tabType ? "" : "hide"}`}>
        <Slider {...settings}>
          {fetchData.length !== 0 ? (
            fetchData.map((item, index) => (
              <VideoItem
                key={index}
                video={item}
                isActive={index === activeIndex && tabIndex === tabType}
                isSwipe={isSwipe}
              />
            ))
          ) : (
            <LoadingBlock />
          )}
        </Slider>
      </div>
    );
  }
);
