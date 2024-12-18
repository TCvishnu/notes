import React from "react";
import "./Styles.css";
import { Icon } from "@iconify/react";

export default function Note(props) {
  const sendIDToMain = () => {
    props.receiveData([props.id, props.title]);
  };

  const sendMaximizeData = () => {
    props.receiveMaximize(props);
  };
  return (
    <button
      className="w-full h-auto py-3 bg-[#fefdf9] sm:w-11/12 rounded-md flex flex-col gap-4 justify-start items-start relative"
      onClick={sendMaximizeData}
    >
      <button onClick={sendIDToMain} className=" absolute right-1 top-1">
        <Icon
          icon="material-symbols:delete"
          className=" size-5 text-[#d8604c]"
        />
      </button>

      <div className="w-full flex flex-col gap-2 text-start">
        <h2 className="mx-2 font-kadwa-bold text-md ">{props.title}</h2>
        <p className="mx-2 font-kadwa-regular text-xs">{props.body}</p>
      </div>
    </button>
  );
}
