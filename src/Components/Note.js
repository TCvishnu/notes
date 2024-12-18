import React from "react";
import "./Styles.css";

export default function Note(props) {
  const sendIDToMain = () => {
    props.receiveData([props.id, props.title]);
  };

  const sendMaximizeData = () => {
    props.receiveMaximize(props);
  };
  return (
    <div className="w-full h-auto py-3 bg-[#fefdf9] sm:w-11/12 rounded-md flex flex-col gap-4 justify-start items-start">
      <div className="flex flex-row w-full gap-1 mx-2">
        <button
          className="w-4 h-4 bg-E84855 rounded-full"
          onClick={sendIDToMain}
        ></button>
        <button
          className="w-4 h-4 bg-EEB868 rounded-full"
          onClick={sendMaximizeData}
        ></button>
      </div>
      <div className="w-full flex flex-col gap-2">
        <h2 className="mx-2 font-kadwa-bold text-md">{props.title}</h2>
        <p className="mx-2 font-kadwa-regular text-xs">{props.body}</p>
      </div>
    </div>
  );
}
