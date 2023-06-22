/* 1a

const Hello = (props) => {
  console.log(props)
  return (
    <>
      <p>Hello {props.name}, you are {props.age} years old</p>
      
    </>
  )
}

const App = () => {
  const friends = [
    {name: "Peter", age:4},
    {name: "Maya", age:10}
  ]
  
  return (
    <>
      <h1>Greetings</h1>
      <p>{friends[0].name} {friends[0].age}</p>
      
    </>
  )
}

export default App*/
/* 1c
import {useState} from 'react'

const Display = ({counter}) => <div>{counter}</div>
  


const Button = ({handleClick, text}) => <button onClick={handleClick}>{text}</button>
  

const App = () => {
  const [counter, setCounter] = useState(0)
  console.log('rendering with counter value', counter)

  const increaseByOne = () => setCounter(counter+1) 
  const decreaseByOne = () => setCounter(counter-1)
  const setToZero = () => setCounter(0)
  

  

  return (
    <>
      <Display counter={counter}/>
      <Button handleClick={increaseByOne} text="Plus"/>
      <Button handleClick={decreaseByOne} text="Minus"/>
      <Button handleClick={setToZero} text="Reset"/>
    </>
  )
}

export default App*/
import {useState} from 'react'

const History = (props) => {
  if (props.allClicks.length === 0)
  {
    return (
      <div>
        the app is used by pressing the buttons
      </div>
    )
  }

  return (
    <div>
      button press history: {props.allClicks.join(' ')}
    </div>
  )
}
const Button = ({handleClick, text}) => (
  <button onClick={handleClick}>
    {text}
  </button>
)

const App = () => {
  const [left, setLeft] = useState(0)
  const [right, setRight] = useState(0)
  const [allClicks, setAll] = useState([])
  const [total, setTotal] = useState(0)

  const handleLeftClick = () => {
    setAll(allClicks.concat('L'))
    const updatedLeft = left + 1
    setLeft(updatedLeft)    
    setTotal(right + updatedLeft)
  }
  const handleRightClick = () => {
    setAll(allClicks.concat('R'))
    const updatedRight = right + 1
    setRight(updatedRight)
    setTotal(updatedRight + left)
  }
  const resetClicks = () => {
    setAll([])
    setTotal(0)
    setLeft(0)
    setRight(0)
  }

  return (
    <>
    {left}
    <Button handleClick={handleLeftClick} text="left" />
    <Button handleClick={handleRightClick} text="right" />
    {right}
    <History allClicks={allClicks}/>
    <p>total {total}</p>
    <Button handleClick={resetClicks} text="reset"/>
    </>
  )

}

export default App
