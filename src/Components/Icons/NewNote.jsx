import React from "react";
import { Icon } from "@iconify/react";

export default function NewNote(props) {
  const createNewNote = async () => {
    try {
      const response = await fetch(
        process.env.REACT_APP_BACKEND_URL + "/api/addNote",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const updatedNotes = await response.json();
      sendNoteToMain(updatedNotes);
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  };
  const sendNoteToMain = (data) => {
    props.receiveData(data);
  };

  return (
    <button
      className="fixed bottom-2 left-1/2 -translate-x-1/2"
      onClick={createNewNote}
    >
      <Icon icon="material-symbols:docs-add-on" width="50" height="50" />
    </button>
  );
}
