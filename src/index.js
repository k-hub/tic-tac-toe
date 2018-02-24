import React from 'react';
import ReactDOM from 'react-dom';
import './index.css'

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}/>
    );
  }

  squaresPerRow(numSquares) {
    const squares = this.props.squares;
    const rows = [];
    let tempRow = [];

    for (let square = 0; square < squares.length; square++) {
      const renderSquare = <span key={square}>{this.renderSquare(square)}</span>;
      if (tempRow.length < numSquares) {
          tempRow.push(renderSquare);
      }
      if (tempRow.length === numSquares) {
        rows.push(tempRow);
        tempRow = [];
      }
    }

    const templatedRows = rows.map((row, rowNum) =>
      <div key={rowNum} className="board-row">
        {row}
      </div>
    );

    return (
      <div>
        {templatedRows}
      </div>
    );
  }

  render() {
    return (
      <div>
        {this.squaresPerRow(3)}
      </div>
    );
  }
}

class SortList extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        ascendingOrder: true,
      };

      this.handleSort = this.handleSort.bind(this);
    }

    handleSort() {
      const isAscending = this.state.ascendingOrder;
      this.setState({ascendingOrder: !isAscending});
    }

    sort(arr) {
      const sortedArr = [...arr].reverse();
      return sortedArr;
    }

    render() {
      const isAscending = this.state.ascendingOrder;
      let moves = this.props.moves;

      if (!isAscending) {
        moves = this.sort(moves);
      }

      return (
        <div>
          <button className="sort-button" onClick={() =>this.handleSort()}>Sort by {isAscending ? 'Descending' : 'Ascending'} Order</button>
          <ol>{moves}</ol>
        </div>
      );
    }
}

class MovesHistory extends React.Component {
  getMoves() {
    const history = this.props.history;
    const activeStep = this.props.activeStep;

    const moves = history.map((step, move) => {
      let desc = 'Go to game start';

      if (move) {
        const previousStep = history[move-1];
        let moveLoc = null;

        step.squares.filter((square, index) => {
          if (previousStep.squares[index] === square) {
            return;
          }
          return moveLoc = getSquareLoc(index);
        });

        desc = 'Go to move ' + moveLoc;
      }

      return (
        <li key={move}>
          <button className={move === activeStep ? 'active' : null} onClick={() => this.props.onClick(move)}>{desc}</button>
        </li>
      );
    });

    return moves;
  }

  render() {
    const moves = this.getMoves();
    return (
      <div>
        <SortList moves={moves}/>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true,
      activeStep: null,
      winningSquares: null,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = [...current.squares];

    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{squares: squares}]),
      stepNumber: history.length,
      activeStep: null,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
      activeStep: step,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winnerDetails = calculateWinner(current.squares);
    const activeStep = this.state.activeStep;

    let status;
    if (winnerDetails) {
      status = 'Winner: ' + winnerDetails.winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            winningSquares={this.state.winningSquares}
            onClick={(i) => this.handleClick(i)} />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <MovesHistory
            history={history}
            activeStep={activeStep}
            onClick={(step) => this.jumpTo(step)} />
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], winningSquares: [a, b, c] };
    }
  }
  return null;
}

function getSquareLoc(index) {
  const squaresMap = {
    0: '(c1, r1)',
    1: '(c2, r1)',
    2: '(c3, r1)',
    3: '(c1, r2)',
    4: '(c2, r2)',
    5: '(c3, r2)',
    6: '(c1, r3)',
    7: '(c2, r3)',
    8: '(c3, r3)',
  };

  return squaresMap[index];
}
// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
