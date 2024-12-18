import React from "react";
import "./Styles.css";
import { Icon } from "@iconify/react";

export default function Note(props) {
  const sendIDToMain = (event) => {
    event.stopPropagation();
    props.receiveData([props.id, props.title]);
  };

  const handleBookmarked = (event) => {
    event.stopPropagation();
    props.bookmarkID(props.id, props.isMarked);
  };

  const sendMaximizeData = () => {
    props.receiveMaximize(props);
  };
  return (
    <button
      className="w-full h-fit py-3 bg-[#fefdf9] sm:w-11/12 rounded-md flex flex-col gap-2 justify-start items-start relative note-shadow"
      onClick={sendMaximizeData}
    >
      <div className="flex w-full px-2 justify-between">
        {props.isMarked ? (
          <div role="button" onClick={handleBookmarked}>
            <Icon
              icon="material-symbols-light:bookmark"
              className=" size-5 text-[#d8604c]"
            />
          </div>
        ) : (
          <div role="button" onClick={handleBookmarked}>
            <Icon
              icon="material-symbols-light:bookmark-outline"
              className=" size-5 "
            />
          </div>
        )}
        <div onClick={sendIDToMain} role="button">
          <Icon
            icon="material-symbols:delete"
            className=" size-5 text-[#d8604c]"
          />
        </div>
      </div>

      <div className="w-full flex flex-col gap-2 text-start">
        <h2 className="px-2 font-kadwa-bold text-md">{props.title}</h2>
        <p className="px-2 font-kadwa-regular text-xs line-clamp-6">
          {props.body}
        </p>
      </div>
    </button>
  );
}
