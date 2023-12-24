import { useState } from 'react'

const NoteForm = ({ createNote }) => {
    const [newNote, setNewNote] = useState('')

    const handleChange = (event) => {
      setNewNote(event.target.value)
    }

    const addNote = (event) => {

        event.preventDefault()
        
        createNote(
            {
                content: newNote, 
                important: true
            }
        )
        setNewNote('')

        
        
      }
    return <div className="formDiv">
      <h2>Create a new note</h2>
    <form onSubmit={addNote}>
      
        <input 
        placeholder="Enter a new note" 
        value={newNote}
        onChange={handleChange}
        id='note-input'
        
        />
        <button type="submit">save</button>
        <br/>
        
      </form>
      
      
      <br/>
      </div>
  }

  export default NoteForm