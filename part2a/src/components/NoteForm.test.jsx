import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import NoteForm from './NoteForm'
import userEvent from '@testing-library/user-event'

test('<NoteForm/> udpates parent state and calls onSubmit', async () => {
    const createNote = jest.fn()
    const user = userEvent.setup()

    render(<NoteForm createNote={createNote}/>)

    //find the textbox by its placeholder value
    const input = screen.getByPlaceholderText('Enter a new note')
    const sendButton = screen.getByText('save')
    /*OR search for textboxes
    const input = screen.getByRole('textbox')

    
    if there are multiple textboxes, use "getAllByRole"

    const inputs = screen.getAllByRole('textbox')

    (this method is sketchy since it relies on the ordering of the textboxes in the array made by getAllByRole)

    await user.type(input[0], 'testing a form...')

    OR search by any attribute of element using container.querySelector

    const { container } = render(<NoteForm createNote={createnote}/>)
    ...
    const input = container.querySelector(#note-input)
    
    
    */

    await user.type(input, 'testing a form...')
    await user.click(sendButton)

    /*console.log(createNote.mock.calls)
     [ [ { content: 'testing a form...', important: true } ] ]
    */
    expect(createNote.mock.calls).toHaveLength(1)
    expect(createNote.mock.calls[0][0].content).toBe('testing a form...')

})