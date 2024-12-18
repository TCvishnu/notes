import React from "react";
import { useState, useEffect } from "react";
import Note from "./Note";
import NewNote from "./Icons/NewNote";
import EditNote from "./EditNote";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import { Snackbar } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
  components: {
    MuiSnackbarContent: {
      styleOverrides: {
        root: {
          backgroundColor: "#4bb543",
          color: "#fff",
          fontSize: "16px",
          fontWeight: 600,
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
        },
      },
    },
  },
});

const errorTheme = createTheme({
  components: {
    MuiSnackbarContent: {
      styleOverrides: {
        root: {
          backgroundColor: "#d8604c",
          color: "#fff",
          fontSize: "16px",
          fontWeight: 600,
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
        },
      },
    },
  },
});

export default function Main() {
  const vertical = "bottom";
  const horizontal = "center";
  const [notes, setNotes] = useState([]);
  const [deleteData, setDeleteData] = useState([]);
  const [openDelConfirem, setOpenDelConfirm] = useState(false);
  const [newNoteOpen, setNewNoteOpen] = useState(false);
  const [delNoteOpen, setDelNoteOpen] = useState(false);
  const [markErrorOpen, setMarkkErrorOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingNote, setEditingNote] = useState({});

  const handleDeleteData = (data) => {
    setDeleteData(data);
    setOpenDelConfirm(true);
  };

  const handleClose = () => {
    setOpenDelConfirm(false);
    setDeleteData([]);
  };

  const handleBookmarked = async (id, marked) => {
    try {
      const sendData = {
        id,
        isMarked: marked,
      };
      const response = await fetch(
        process.env.REACT_APP_BACKEND_URL + `/api/updateMarked/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify(sendData),
        }
      );

      if (!response.ok) {
        if (response.status === 501) {
          const errorData = await response.json();
          console.log(errorData.message); //
          setMarkkErrorOpen(true);
          return;
        }
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      setNotes(await response.json());
    } catch (error) {
      console.error(error);
    }
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
    setNewNoteOpen(true);
  };

  const handleNewNoteSnackbarClose = () => {
    setNewNoteOpen(false);
  };

  const handleDelNoteSnackbarClose = () => {
    setDelNoteOpen(false);
  };
  const handleMarkSnackbarClose = () => {
    setMarkkErrorOpen(false);
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
      setDelNoteOpen(true);
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
    <div className="w-screen h-screen flex flex-col items-center gap-8 bg-[#efe6d8] ">
      {!isEditing && (
        <div className="flex justify-between w-full px-3">
          <h1 className="text-2xl font-semibold mt-4 font-kadwa-bold border-b-2 border-b-black w-1/12">
            Notes
          </h1>
        </div>
      )}

      {!isEditing && (
        <div className="w-full h-auto grid grid-cols-2 gap-3 md:grid-cols-3 px-3">
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
                  bookmarkID={handleBookmarked}
                  isMarked={note.isMarked}
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
        open={openDelConfirem}
        onClose={handleClose}
        disableEnforceFocus
        disablePortal
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle className=" text-red-600">
          Delete {deleteData[1] ? deleteData[1] : "this note"}
        </DialogTitle>
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

      <ThemeProvider theme={theme}>
        <Snackbar
          anchorOrigin={{ vertical, horizontal }}
          key="new-note-made"
          open={newNoteOpen}
          autoHideDuration={4000}
          onClose={handleNewNoteSnackbarClose}
          message="New note created successfully"
        />
        <Snackbar
          anchorOrigin={{ vertical, horizontal }}
          key="delete-note"
          open={delNoteOpen}
          autoHideDuration={4000}
          onClose={handleDelNoteSnackbarClose}
          message="Note deleted successfully"
        />
      </ThemeProvider>
      <ThemeProvider theme={errorTheme}>
        <Snackbar
          anchorOrigin={{ vertical, horizontal }}
          key="mark"
          open={markErrorOpen}
          autoHideDuration={4000}
          onClose={handleMarkSnackbarClose}
          message="Only 3 notes can be pinned!!"
        />
      </ThemeProvider>
    </div>
  );
}
