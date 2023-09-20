import './GameOver.css'

const GameOver = ({ retry, score }) => {
  return (
    <div>
      <h2>Fim de jogo!</h2>
      <p>A sua pontuação foi: <span>{score}</span></p>
      <button onClick={retry}>Reiniciar</button>
    </div>
  )
}

export default GameOver