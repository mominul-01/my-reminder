import React, { useState, useEffect } from 'react';

const App = () => {
  const [notes, setNotes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [newNote, setNewNote] = useState({ title: '', description: '', date: '', time: '' });

  const playAlarm = () => {
    const audio = new Audio('alarm.mp3');
    audio.play();
  };

  const showNotification = (title) => {
    if (Notification.permission === 'granted') {
      new Notification('Reminder', { body: title });
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          new Notification('Reminder', { body: title });
        }
      });
    }
  };

  const handleAddNote = () => {
    if (editIndex !== null) {
      // If editIndex is not null, update the existing note
      const updatedNotes = [...notes];
      updatedNotes[editIndex] = newNote;
      setNotes(updatedNotes);
      saveToLocalStorage(updatedNotes);
      setEditIndex(null);
    } else {
      // If editIndex is null, add a new note
      const updatedNotes = [...notes, newNote];
      setNotes(updatedNotes);
      saveToLocalStorage(updatedNotes);
    }

    setNewNote({ title: '', description: '', date: '', time: '' });
    setShowModal(false);
  };

  const handleEditNote = (index) => {
    setEditIndex(index);
    setNewNote(notes[index]);
    setShowModal(true);
  };

  const handleDeleteNote = (index) => {
    const updatedNotes = [...notes];
    updatedNotes.splice(index, 1);
    setNotes(updatedNotes);
    saveToLocalStorage(updatedNotes);
  };

  const saveToLocalStorage = (data) => {
    localStorage.setItem('notes', JSON.stringify(data));
  };

  const getFromLocalStorage = () => {
    const storedNotes = localStorage.getItem('notes');
    return storedNotes ? JSON.parse(storedNotes) : [];
  };

  useEffect(() => {
    const storedNotes = getFromLocalStorage();
    setNotes(storedNotes);
  }, []);

  useEffect(() => {
    const checkReminders = setInterval(() => {
      const now = new Date();
      notes.forEach((note, index) => {
        const reminderTime = new Date(`${note.date}T${note.time}`);
        if (reminderTime <= now && reminderTime.getTime() + 60000 > now.getTime()) {
          playAlarm();
          showNotification(note.title);
          handleDeleteNote(index);
        }
      });
    }, 1000);

    return () => clearInterval(checkReminders);
  }, [notes]);


  return (
    <div className="min-h-screen flex  justify-center bg-gradient-to-l from-[#c2ceb6] to-[#64b3f4]">
   
      <div className=" w-full p-4">
        <h1 className="text-4xl font-bold text-center mt-5">Reminder App</h1>

        
        <div className='flex justify-center mt-5'>
             <button
          className=" w-1/3 mt-6 bg-gradient-to-r from-[#c2ceb6] to-[#64b3f4]  text-left pl-5 outline-dashed outline-2 outline-offset-2  text-black  text-3xl   py-2 rounded-md hover:from-pink-500 hover:to-yellow-500"
          onClick={() => setShowModal(true)}
        >
          Add Reminder...
        </button>
        </div>

        <div className="mt-6  grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {notes.map((note, index) => (
            <div key={index} className="bg-gradient-to-b from-[#c2ceb6] to-[#64b3f4]  outline-dashed outline-2 outline-offset-2  rounded-md shadow-md p-4">
              <h2 className="text-black text-lg font-bold mb-2">Title: {note.title}</h2>
              <p className="text-black text-lg mb-4">Des...: {note.description}</p>
              <p className='text-black text-lg mb-4'>Date: {note.date} || <span> Time: {note.time}</span> </p>
            
               <div className="flex mt-5 justify-between">
                <button
                  className="mr-2 bg-blue-500 text-white px-3 py-1 outline-dashed outline-2 outline-offset-2 rounded-md"
                  onClick={() => handleEditNote(index)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 text-white outline-dashed outline-2 outline-offset-2 px-3 py-1 rounded-md"
                  onClick={() => handleDeleteNote(index)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

       
      </div>
      
      {showModal && (
        <div className="fixed inset-0 bg-gradient-to-r from-[#c2ceb6] to-[#64b3f4] bg-opacity-75 flex items-center justify-center">
          <div className="bg-gradient-to-r from-[#c2ceb6] to-[#64b3f4] p-4 w-full max-w-md rounded-md shadow-md outline-dashed outline-2 outline-offset-2">
            <h2 className="text-xl font-bold mb-4">Add Note</h2>
            <div className="mb-4 ">
              <label htmlFor="title" className="block text-lg font-medium text-gray-600">
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={newNote.title}
                onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                className="mt-1 p-2 w-full border rounded-md outline-dashed outline-2 outline-offset-2"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="description" className="block text-lg font-medium text-gray-600">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={newNote.description}
                onChange={(e) => setNewNote({ ...newNote, description: e.target.value })}
                className="mt-1 p-2 w-full border rounded-md outline-dashed outline-2 outline-offset-2"
              ></textarea>
            </div>
            <div className="mb-4">
              <label htmlFor="date" className="block text-lg font-medium text-gray-600">
                Date
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={newNote.date}
                onChange={(e) => setNewNote({ ...newNote, date: e.target.value })}
                className="mt-1 p-2 w-full border rounded-md outline-dashed outline-2 outline-offset-2"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="time" className="block text-lg font-medium text-gray-600">
                Time
              </label>
              <input
                type="time"
                id="time"
                name="time"
                value={newNote.time}
                onChange={(e) => setNewNote({ ...newNote, time: e.target.value })}
                className="mt-1 p-2 w-full border rounded-md outline-dashed outline-2 outline-offset-2"
              />
            </div>
            <div className="flex justify-end mt-5">
              <button
                className="bg-green-500 text-white px-4 py-2 rounded-md"
                onClick={handleAddNote}
              >
                Done
              </button>
              <button
                className="ml-2 bg-gray-300 text-gray-700 px-4 py-2 rounded-md"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
