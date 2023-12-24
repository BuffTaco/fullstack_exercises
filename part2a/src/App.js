import {useState, useEffect, useRef } from 'react'

import Note from './components/Note'
import noteService from './services/notes'
import loginService from './services/login'
import LoginForm from './components/LoginForm'
import NoteForm from './components/NoteForm'
import Togglable from './components/Togglable'

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
  
  const [showAll, setShowAll] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)
  const [errorType, setErrorType] = useState("success")
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [loginVisible, setLoginVisible] = useState(false)

  const hook = () => {
    noteService
    .getAll()
    .then(initialNotes => {
      setNotes(initialNotes)
    }
    )
  }
  useEffect(hook, [])
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    if (loggedUserJSON)
    {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      noteService.setToken(user.token)
    }
  }, [])

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
  const addNote = (noteObject) => {
    noteFormRef.current.toggleVisibility()
    noteService
    .create(noteObject)
    .then(returnedNote => {
      setNotes(notes.concat(returnedNote))
      setErrorType("success")
      setErrorMessage(`${noteObject.content} was successfully added`)
    })
    
  }
  
  const handleLogout = (event) => {
    window.localStorage.removeItem('loggedNoteappUser')
    window.location.reload()
  }
  const handleLogin = async (event) => {
    event.preventDefault()
    console.log('logging in with', username, password)
    try
    {
      const user = await loginService.login({
        username, password
      })
      window.localStorage.setItem('loggedNoteappUser', JSON.stringify(user))

      noteService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    }
    catch (exception)
    {
      console.log(exception)
      setErrorType("error")
      setErrorMessage('Wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
    
  }
  
  const loginForm = () => {
    const hideWhenVisible = { display: loginVisible ? 'none' : ''}
    const showWhenVisible  = { display: loginVisible ? '': 'none' }
    return (
      <div>
        <div style={hideWhenVisible}>
          <button onClick={() => {setLoginVisible(true)}}>log in</button>
        </div>
        <div style={showWhenVisible}>
          <LoginForm
          username={username}
          password={password}
          handleLogin={handleLogin}
          handleUserChange={({target}) => setUsername(target.value)}
          handlePasswordChange={({target}) => setPassword(target.value)}
          
          />
          
          <button onClick={() => {setLoginVisible(false)}}>cancel</button>
        </div>

      </div>
    )
  }
  /*
   * const loginForm = () => {
    
    return (
      
        <Togglable buttonLabel="login">
          <LoginForm
          username={username}
          password={password}
          handleUserChange={({ target }) => setUsername(target.value)}
          handlePasswordChange={({ target }) => setPassword(target.value)}
          handleLogin={handleLogin}
          />
        </Togglable>

      
    )
  }
   */
  const noteFormRef = useRef()
  const noteForm = () => {
    return <>
      
    <Togglable buttonLabel="New note" ref={noteFormRef} >
      <NoteForm
        createNote={addNote}
      />
      
    </Togglable>
    <Togglable>Test</Togglable>
    
    <button onClick={handleLogout}>logout</button>
    <br/>
      </>
  }

  /*if showAll, all notes in notesToShow, otherwise filter and keep only the important notes*/ 
  const notesToShow = showAll
  ? notes
  : notes.filter(note=>note.important)/*equal to note=>note.important===true */
 

  return (
    
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} type={errorType}/>
      {user === null
      ? loginForm()
      : noteForm()
      }
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
      <Footer/>
    </div>

  )
  
}

export default App;
