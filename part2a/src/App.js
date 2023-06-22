import {useState, useEffect} from 'react'
import axios from 'axios'
import Note from './components/Note'
import noteService from './services/notes'

const Notification = ({message, type}) => {
  if (message === null)
  {
    return null;
  }
  return (
    <div className={type}>
      {message}
    </div>
  )
    
}
const Footer = () => {
  const footerStyle = {
    color: "green",
    fontStyle: "italic",
    fontSize: 16
  }
  return (
    <div style={footerStyle}>
      <br/>
      <em>Note app, Department of Computer Science, University of Helsinki 2022</em>
    </div>
  )
}
const App = (props) => {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('')
  const [showAll, setShowAll] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)
  const [errorType, setErrorType] = useState("success")

  const hook = () => {
    noteService
    .getAll()
    .then(initialNotes => {
      setNotes(initialNotes)
    }
    )
  }
  useEffect(hook, [])

  const toggleImportanceOf = (id) => {
    const note = notes.find(n => n.id === id)
    const changedNote = {...note, important: !note.important}
    
    noteService
    .update(id, changedNote)
    .then(returnedNote => {
      setNotes(notes.map(note => note.id !== id ? note : returnedNote))
    })
    .catch(error => {
      setErrorType("error")
      setErrorMessage(`Note ${note.content} was already removed from the server`)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
      setNotes(notes.filter(n => n.id !== id))
    })
  }

  const addNote = (event) => {
    event.preventDefault()
    const noteObject = {
      content: newNote, 
      important: Math.random() < 0.5
    }
    noteService
    .create(noteObject)
    .then(returnedNote => {
      setNotes(notes.concat(returnedNote))
      setNewNote('')
      setErrorType("success")
      setErrorMessage(`${noteObject.content} was successfully added`)
    })
    
  }
  const handleNoteChange = (event) => {
    setNewNote(event.target.value)
  }

  /*if showAll, all notes in notesToShow, otherwise filter and keep only the important notes*/ 
  const notesToShow = showAll
  ? notes
  : notes.filter(note=>note.important)/*equal to note=>note.important===true */
 

  return (
    
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} type={errorType}/>
      <>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all'}
        </button>
      </>
      <ul>
        {
        notesToShow.map(note =>
        <Note key={note.id} 
        note={note}
        toggleImportance = {() => toggleImportanceOf(note.id)}/>)
        }
      </ul>
      <form onSubmit={addNote}>
        <input placeholder="Enter a new note" value={newNote}
        onChange={handleNoteChange}/>
        <button type="submit">save</button>

      </form>
      <Footer/>
    </div>

  )
  
}

export default App;
