import React from "react";
import { useState, useEffect } from "react";
import Note from "./Note";
import NewNote from "./Icons/NewNote";
import EditNote from "./EditNote";
import Dialog from "@mui/material/Dialog";
import Slide from "@mui/material/Slide";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";

export default function Main() {
  const [notes, setNotes] = useState([]);
  const [deleteData, setDeleteData] = useState("");
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingNote, setEditingNote] = useState({});

  const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

  const handleDeleteData = (data) => {
    setDeleteData(data);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleStopEdit = () => {
    setIsEditing(false);
  };

  const handleUpdateStop = (data) => {
    setNotes(data);
    setIsEditing(false);
  };

  const handleMaximize = (data) => {
    setEditingNote(data);
    setIsEditing(true);
  };

  const handleNewNoteMade = (data) => {
    setNotes(data);
  };

  const deleteNoteFromBackend = async () => {
    try {
      const response = await fetch(
        process.env.REACT_APP_BACKEND_URL + `/api/delNotes/${deleteData[0]}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const updatedNotes = await response.json();
      setNotes(updatedNotes);
      handleClose();
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  };

  const fetchNotes = () => {
    fetch(process.env.REACT_APP_BACKEND_URL + "/api/notes")
      .then((response) => response.json())
      .then((json) => {
        setNotes(json);
      })
      .catch((error) => console.error("Error fetching notes:", error));
  };
  useEffect(() => {
    fetchNotes();
  }, []);
  return (
    <div className="w-screen h-screen flex flex-col items-center gap-8 bg-[#efe6d8]">
      {!isEditing && (
        <header className="text-2xl font-semibold mt-4 font-kadwa-bold w-5/12 text-center border-b-2 border-b-black">
          Notes
        </header>
      )}

      {!isEditing && (
        <div className="w-full h-auto grid grid-cols-2 gap-3 px-3 md:grid-cols-3">
          {notes.length > 0 &&
            notes.map((note, index) => {
              return (
                <Note
                  id={note._id}
                  title={note.title}
                  body={note.body}
                  key={index}
                  receiveData={handleDeleteData}
                  receiveMaximize={handleMaximize}
                />
              );
            })}
        </div>
      )}
      {!isEditing && <NewNote receiveData={handleNewNoteMade} />}

      {isEditing && (
        <EditNote
          curNote={editingNote}
          stopEdit={handleStopEdit}
          updateStop={handleUpdateStop}
        />
      )}

      <Dialog
        open={open}
        TransitionComponent={Transition}
        onClose={handleClose}
        keepMounted
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle className=" text-red-600">{`Delete ${deleteData[1]}`}</DialogTitle>
        <DialogContent>
          <p className=" text-gray-600 font-medium leading-relaxed">
            Are you sure you want to delete this note? This action can't be
            undone
          </p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="info">
            Cancel
          </Button>
          <Button onClick={deleteNoteFromBackend} color="warning">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
