import React from "react"
import '../../assets/stylesheets/application.scss'

const CELL_SIZE = 15;
const WIDTH = 720;
const HEIGHT = 480;

class Cell extends React.Component {
  render() {
    const { x, y } = this.props;
    return (
      <div className="Cell" style={{
        left: `${CELL_SIZE * x + 1}px`,
        top: `${CELL_SIZE * y + 1}px`,
        width: `${CELL_SIZE - 1}px`,
        height: `${CELL_SIZE - 1}px`,
      }}/>
    );
  }
}

class Gol extends React.Component {
  constructor() {
    super();
    this.rows = HEIGHT / CELL_SIZE;
    this.cols = WIDTH / CELL_SIZE;
    this.board = this.makeBoard();
  }

  state = {
    cells: [],
    frequency: 100,
    isRunning: false,
  }

  // Create an empty board
  makeBoard() {
    let board = [];
    for (let y = 0; y < this.rows; y++) {
      board[y] = [];
      for (let x = 0; x < this.cols; x++) {
        board[y][x] = false;
      }
    }

    return board;
  }

  // returns the offset value to use when clicking
  getElementOffset() {
    const rect = this.boardRef.getBoundingClientRect();
    const doc = document.documentElement;

    return {
      x: (rect.left + window.pageXOffset) - doc.clientLeft,
      y: (rect.top + window.pageYOffset) - doc.clientTop,
    };
  }

  // Create cells from this.board
  makeCells() {
    let cells = [];
    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.cols; x++) {
        if (this.board[y][x]) {
          cells.push({ x, y });
        }
      }
    }

    return cells;
  }

  // click event will toggle the state for the cell
  handleClick = (event) => {
    const elemOffset = this.getElementOffset();
    const offsetX = event.clientX - elemOffset.x;
    const offsetY = event.clientY - elemOffset.y;
    const x = Math.floor(offsetX / CELL_SIZE);
    const y = Math.floor(offsetY / CELL_SIZE);

    if (x >= 0 && x <= this.cols && y >= 0 && y <= this.rows) {
      this.board[y][x] = !this.board[y][x];
    }

    this.setState({ cells: this.makeCells() });
  }

  runGame = () => {
    this.setState({ isRunning: true });
    this.runUpdate();
  }

  stopGame = () => {
    this.setState({ isRunning: false });
    if (this.timeoutHandler) {
      window.clearTimeout(this.timeoutHandler);
      this.timeoutHandler = null;
    }
  }

  // runUpdate repeats for every frequency tick, checks neighbor cells and updates the board
  // following the game of life rules
  runUpdate() {
    let newBoard = this.makeBoard();

    // create a new board and apply the game rules
    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.cols; x++) {
        let neighbors = this.calculateNeighbors(this.board, x, y);
        if (this.board[y][x]) {
          // Any live cell with two or three live neighbours survives.
          if (neighbors === 2 || neighbors === 3) {
            newBoard[y][x] = true;
          } else {
            // All other live cells die in the next generation. Similarly, all other dead cells stay dead.
            newBoard[y][x] = false;
          }
        } else {
          // Any dead cell with three live neighbours becomes a live cell.
          if (!this.board[y][x] && neighbors === 3) {
            newBoard[y][x] = true;
          }
        }
      }
    }

    // apply updates to the board
    this.board = newBoard;
    this.setState({ cells: this.makeCells() });
    this.timeoutHandler = window.setTimeout(() => { this.runUpdate(); }, this.state.frequency);
  }

  // calculate the number of neighbors at point (x, y) in the board array
  calculateNeighbors(board, x, y) {
    let neighbors = 0;
    // coordinates for the eight neighbor cells
    const dirs = [[-1, -1], [-1, 0], [-1, 1], [0, 1], [1, 1], [1, 0], [1, -1], [0, -1]];
    // each neighbor
    for (let i = 0; i < dirs.length; i++) {
      const dir = dirs[i];
      let y1 = y + dir[0];
      let x1 = x + dir[1];

      // if the neighbor cell is alive, increment neighbours count
      if (x1 >= 0 && x1 < this.cols && y1 >= 0 && y1 < this.rows && board[y1][x1]) {
        neighbors++;
      }
    }

    return neighbors;
  }

  handleFrequencyChange = (event) => {
    this.setState({ frequency: event.target.value });
  }

  handleClear = () => {
    this.board = this.makeBoard();
    this.setState({ cells: this.makeCells() });
  }

  handleRandom = () => {
    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.cols; x++) {
        this.board[y][x] = (Math.random() >= 0.5);
      }
    }

    this.setState({ cells: this.makeCells() });
  }

  render() {
    const { cells, frequency, isRunning } = this.state;

    return (
      <React.Fragment>
        <div class="container-fluid">
          <h3>{ this.props.name }</h3>
          <div>
            <div className="Board"
                style={{ width: WIDTH, height: HEIGHT, backgroundSize: `${CELL_SIZE}px ${CELL_SIZE}px`}}
                onClick={this.handleClick}
                ref={(n) => { this.boardRef = n; }}>

              {cells.map(cell => (
                <Cell x={cell.x} y={cell.y} key={`${cell.x},${cell.y}`}/>
              ))}
            </div>
          </div>

          <div className="controls">
            Update frequency in ms: <input value={frequency} onChange={this.handleFrequencyChange} />
            {isRunning ? <button className="button" onClick={this.stopGame}>Stop</button>
                      : <button className="button" onClick={this.runGame}>Run</button>
            }
            <button className="button" onClick={this.handleRandom}>Random</button>
            <button className="button" onClick={this.handleClear}>Clear</button>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

Gol.propTypes = {
  name: PropTypes.string,
};
export default Gol
