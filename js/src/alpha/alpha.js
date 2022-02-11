import React from "react";
import ReactDOM from "react-dom";

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
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
        },
      ],
      xIsFirst: true,
      stepNumber: 0,
    };
  }

  xIsNext(stepNumber) {
    if (typeof stepNumber === "number") {
      return (
        (this.state.xIsFirst && stepNumber % 2 === 0) ||
        (!this.state.xIsFirst && stepNumber % 2 === 1)
      );
    }
    return (
      (this.state.xIsFirst && this.state.stepNumber % 2 === 0) ||
      (!this.state.xIsFirst && this.state.stepNumber % 2 === 1)
    );
  }

  handleClick(i) {
    if (!this.xIsNext()) return;
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) return;
    squares[i] = "X";
    this.setState(
      {
        history: history.concat([
          {
            squares: squares,
          },
        ]),
        stepNumber: history.length,
      },
      () => {
        this.queryBot();
      }
    );
  }

  async queryBot() {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) !== undefined) return;
    let query = "";
    for (let j = 0; j < squares.length; j++) {
      if (squares[j]) query += squares[j];
      else query += "-";
    }
    let url = "https://alpha-tictactoe-zero.herokuapp.com/api/" + query;
    try {
      let response = await fetch(url);
      let a = Number(await response.json());
      squares[a] = "O";
      this.setState({
        history: history.concat([
          {
            squares: squares,
          },
        ]),
        stepNumber: history.length,
      });
    } catch (err) {
      alert(err);
    }
  }

  jumpTo(move) {
    this.setState({
      stepNumber: move,
    });
  }

  restart(xIsFirst) {
    this.setState(
      {
        history: [
          {
            squares: Array(9).fill(null),
          },
        ],
        xIsFirst: xIsFirst,
        stepNumber: 0,
      },
      () => {
        if (!this.xIsNext()) this.queryBot();
      }
    );
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const moves = history.map((step, move) => {
      if (this.xIsNext(move)) {
        const desc = move ? "Go to move #" + move : "Go to game start";
        return (
          <li key={move}>
            <button onClick={() => this.jumpTo(move)}>{desc}</button>
          </li>
        );
      }
    });

    const restart = [true, false].map((val, idx) => {
      const desc = val
        ? "Restart game and go first"
        : "Restart game and go second";
      return (
        <li key={idx}>
          <button onClick={() => this.restart(val)}>{desc}</button>
        </li>
      );
    });

    const role = "You => 'X'; Alpha => 'O'";
    let status = null;
    if (winner) {
      status = "Winner: " + winner;
    } else if (winner === null) {
      status = "Draw";
    } else {
      status = "Next player: " + (this.xIsNext() ? "X" : "O");
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{role}</div>
          <ul>{restart}</ul>
          <div>{status}</div>
          <ul>{moves}</ul>
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
      return squares[a];
    }
  }
  if (squares.includes(null) === true) return undefined;
  else return null;
}

// ========================================
ReactDOM.render(<Game />, document.getElementById("app"));
