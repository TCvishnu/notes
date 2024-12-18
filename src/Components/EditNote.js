import React, { useState } from "react";

export default function EditNote(props) {
  const [title, setTitle] = useState(props.curNote.title);
  const [body, setBody] = useState(props.curNote.body);

  const handleClose = () => {
    props.stopEdit();
  };

  const handleUpdateClose = (data) => {
    props.updateStop(data);
  };

  const handleUpdateEdit = async () => {
    const sendData = {
      id: props.curNote.id,
      newTitle: title,
      newBody: body,
    };

    try {
      const response = await fetch(
        process.env.REACT_APP_BACKEND_URL + `/api/updateNote/${sendData.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(sendData),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      handleUpdateClose(await response.json());
    } catch (error) {
      console.error("FrontEnd Error: ", error);
    }
  };

  return (
    <div className="w-full h-full bg-[#fefdf9] flex flex-col gap-8 px-2">
      <div className="flex flex-row w-full gap-1 mt-2">
        <button
          className="w-5 h-5 bg-EEB868 rounded-full"
          onClick={handleUpdateEdit}
          title="Make Changes"
        ></button>

        <button
          className="w-5 h-5 bg-456990 rounded-full"
          title="Cancel All Edits"
          onClick={handleClose}
        ></button>
      </div>

      <textarea
        className="bg-transparent w-full h-8 outline-none overflow-y-auto font-kadwa-bold"
        value={title}
        placeholder="Title"
        onChange={(e) => {
          setTitle(e.target.value);
        }}
      ></textarea>
      <div className="h-1 bg-black w-full px-2"></div>
      <textarea
        className="bg-transparent w-full outline-none h-4/6 overflow-y-auto font-kadwa-regular"
        value={body}
        placeholder="Body"
        onChange={(e) => {
          setBody(e.target.value);
        }}
      ></textarea>
    </div>
  );
}
