import React from 'react';
import Cell from './Cell';
import './Board.css';
import 'bootstrap/dist/css/bootstrap.min.css';
class Board extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cells: [
                null, null, null,
                null, null, null,
                null, null, null
            ],
            status: null,
            moveNumber: 0,
        };
        this.restart = this.restart.bind(this);
    }

    getPossibleMoves(board, turn) {
        let possibleMoves = [];
        for (let i = 0; i < board.length; i++) {
            if (board[i] === null) {
                let newBoard = board.slice();
                newBoard[i] = turn;
                possibleMoves.push(newBoard);
            }
        }
        return possibleMoves;
    }

    miniMax(board, turn, numberOfLookAHead, alpha, beta) {
        if (numberOfLookAHead === 0) {
            return [board, this.heuristic(board)];
        }
        let possibleMoves = this.getPossibleMoves(board, turn);
        if (possibleMoves.length === 0) {
            return [board, this.heuristic(board)];
        }
        // If O is playing --> they looks for the winning score is -1000, otherwise, X player looks for 1000 
        // We set the lookingWinningScore to the worst score they can get, then compare it with the winning scores of each board to find the best score for each player
        let lookingWinningScore = (turn === 'X') ? -1000 : 1000;
        const nextTurn = (turn === 'X') ? 'O' : 'X';
        let chosenMove;
        for (let i = 0; i < possibleMoves.length; i++) {
            // O wants to minimize their score since their winning score is -1000
            if (turn === 'O') {
                let temp = this.miniMax(possibleMoves[i], nextTurn, numberOfLookAHead - 1, alpha, beta);
                if (lookingWinningScore >= temp[1]) {
                    chosenMove = possibleMoves[i]; // possibleMoves[i] since you want the best move at the current (this) turn, not the best move at the last turn eg: temp[0]
                    lookingWinningScore = temp[1];
                    beta = Math.min(beta, lookingWinningScore);
                }
            } else {
                let temp = this.miniMax(possibleMoves[i], nextTurn, numberOfLookAHead - 1, alpha, beta);
                if (lookingWinningScore <= temp[1]) {
                    chosenMove = possibleMoves[i];
                    lookingWinningScore = temp[1];
                    alpha = Math.max(alpha, lookingWinningScore);
                }
            }
            if (beta < alpha) {
                break;
            }
        }

        if (!chosenMove) {
            throw new Error("Could not find a move.");
        }

        return [chosenMove, lookingWinningScore];
    }

    // Estimate a winning point of a symbol (X/O) in the current board
    heuristic(board) {
        let winningScore = this.determineWinner(board);
        if (winningScore === 'O') {
            return -1000; //-1000 means the O player won 
        } else if (winningScore === 'X') {
            return 1000; // 1000 means the X player won 
        } else {
            return 0; // 0 means the game is either not finish or tied
        }
    }

    determineWinner(newCells) {
        const lines = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ]
        for (let i = 0; i < lines.length; i++) {
            let currentLine = lines[i];
            if (newCells[currentLine[0]] === newCells[currentLine[1]] && newCells[currentLine[1]] === newCells[currentLine[2]]) {
                this.props.onStateChange(newCells[currentLine[0]]);
                return newCells[currentLine[0]];
            }
        }
        for (let i = 0; i < newCells.length; i++) {
            if (newCells[i] === null) {
                this.props.onStateChange(null);
                return null;
            }
        }
        this.props.onStateChange("Tie");
        return "Tie";
    }

    computerPlay() {
        if (this.state.status !== null) {
            return;
        }
        const currentSymbol = (this.state.moveNumber % 2 === 0) ? 'X' : 'O';
        const newboard = this.miniMax(this.state.cells, currentSymbol, -1000, 1000)[0];
        let nextMove;
        for (let i = 0; i < newboard.length; i++) {
            if (newboard[i] !== null && this.state.cells[i] === null) {
                nextMove = i;
                break;
            }
        }
        this.displayXO(nextMove, false);
    }

    displayXO(i, isHuman) {
        //console.log(this.props.value);
        const newCells = this.state.cells.slice();
        newCells[i] = (this.state.moveNumber % 2 === 0) ? 'X' : 'O';
        const newMoveNumber = this.state.moveNumber + 1;
        let newState = { cells: newCells, status: this.determineWinner(newCells), moveNumber: newMoveNumber }
        if (isHuman) {
            this.setState(newState, () => { this.computerPlay() });
        } else {
            this.setState(newState);
        }

    }

    createCell(i) {
        return <Cell value={this.state.cells[i]} onClick={() => this.cellOnClick(i)} />
    }

    cellOnClick(i) {
        const currentPlayer = (this.state.moveNumber % 2 === 0) ? 'X' : 'O';
        if (this.props.value !== currentPlayer || this.state.cells[i] !== null || this.state.status !== null) {
            return;
        }
        this.displayXO(i, true);
    }

    restart() {
        const newState = {
            cells: [
                null, null, null,
                null, null, null,
                null, null, null
            ],
            status: null,
            moveNumber: 0,
        }
        this.setState(newState);
    }

    render() {
        return (
            <table id="board">
                <tbody>
                    <tr>
                        {this.createCell(0)}
                        {this.createCell(1)}
                        {this.createCell(2)}
                    </tr>
                    <tr>
                        {this.createCell(3)}
                        {this.createCell(4)}
                        {this.createCell(5)}
                    </tr>
                    <tr>
                        {this.createCell(6)}
                        {this.createCell(7)}
                        {this.createCell(8)}
                    </tr>
                </tbody>
            </table>
        );
    }
}
export default Board;