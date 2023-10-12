import { wordsList } from './data/words'
import './App.css'
import StartScreen from './components/StartScreen'
import Game from './components/Game'
import GameOver from './components/GameOver'
import { useCallback, useEffect, useState  } from 'react'

const stages = [
  { id: 1, name: 'start' },
  { id: 2, name: 'game' },
  { id: 3, name: 'end' },
]

const guessesQty = 3
function App() {
  const [gameStage, setGameStage] = useState(stages[0].name)
  const [words] = useState(wordsList)

  const [pickedWord, setPickedWord] = useState()
  const [pickedCategory, setPickeCategory] = useState()
  const [letters, setLetters] = useState([])

  const [guessedLetters, setGuessedLetters] = useState([])
  const [wrongLetters, setWrongLetters] = useState([])
  const [guesses, setGuesses] = useState(guessesQty)
  const [score, setScore] = useState(0)

  const pickedWordAndCategory = useCallback(() => {
    //PICK A RANDOM CATEGORY
    const categories = Object.keys(words)
    const category = categories[Math.floor(Math.random() * Object.keys(categories).length)]

    //PICK A RANDOM WORD
    const word = words[category][Math.floor(Math.random() * words[category].length)]

    return { category, word }

  }, [words])

  //STARTS THE SECRET WORD GAME
  const startGame = useCallback(() => {

    // clear all letters
    clearLetterStates()


    const { category, word } = pickedWordAndCategory()

    //CREATE AN ARRAYS OF LETTERS
    let wordLetters = word.split('')
    wordLetters = wordLetters.map( (l) => l.toLowerCase())

    //FILL STATES
    setPickedWord(word)
    setPickeCategory(category)
    setLetters(wordLetters)

    setGameStage(stages[1].name)
  }, [pickedWordAndCategory])

  //PROCESS THE LETTER INPUT
  const verifyLetter = (letter) => {
    const normalizeLetter = letter.toLowerCase()

    // check if letter has already been utilized
    if(guessedLetters.includes(normalizeLetter) || wrongLetters.includes(normalizeLetter)) {
      return
    }

    // push guessed letter or remove a guess 
    if(letters.includes(normalizeLetter)) {
      setGuessedLetters((actualGuessedLetters) => [
        ...actualGuessedLetters,
        normalizeLetter
      ])
    } else {
      setWrongLetters((actualWrongLetters) => [
        ...actualWrongLetters,
        normalizeLetter
      ])

      setGuesses((actualGuesses) => actualGuesses -1)
    }

  }

  const clearLetterStates = () => {
    setGuessedLetters([])
    setWrongLetters([])
  }

  // check if guesses end
  useEffect(() => {
    if(guesses <= 0) {
      clearLetterStates()
      setGameStage(stages[2].name)
    }
  }, [guesses])

  // check win condition
  useEffect(() => {
    const uniqueLetters = [... new Set(letters)]

    if(guessedLetters.length === uniqueLetters.length) {
      // add score
      setScore((actualScore) => actualScore += 100)

      // restart game with new word
      startGame()
    }
    // win conditon
  }, [guessedLetters, letters, startGame], )

  // RESTARTS THE GAME
  const retry = () => {
    setScore(0)
    setGuesses(guessesQty)
    setGameStage(stages[0].name)
  }

  return (
    <div className='App'>
      {gameStage === 'start' && <StartScreen startGame={startGame}/>}
      {gameStage === 'game' && <Game 
      verifyLetter={verifyLetter} 
      pickedWord={pickedWord} 
      pickedCategory={pickedCategory}
      letters={letters}
      guessedLetters={guessedLetters}
      wrongLetters={wrongLetters}
      guesses={guesses}
      score={score}
      />}
      {gameStage === 'end' && <GameOver retry={retry} score={score}/>}
    </div>
  )
}

export default App
