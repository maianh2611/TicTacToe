import React from 'react';
import SideSelect from './SideSelect';
import Board from './Board';
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      chosenSide: null,
      showSideSelect: true,
      winner: null,
    }
    this.getWinner = this.getWinner.bind(this);
    this.restart = this.restart.bind(this);
    this.board = React.createRef();
  }

  createSideSelect(side) {
    return side === 'O' ? <SideSelect value = {side} onClick={()=> this.setState({chosenSide : side, showSideSelect: false}, () => {setTimeout(() => {this.board.current.computerPlay();
    }, 50)})} />
          : <SideSelect value = {side} onClick={()=> this.setState({chosenSide : side, showSideSelect: false})} />
  }

  getWinner(newWiner) {
    this.setState({winner : newWiner});
  }

  displayWinner() {
    if (this.state.winner === null) {
      return "";
    }
    if (this.state.winner === 'Tie') {
      return "It's a tie!";
    }
    if (this.state.winner !== this.state.chosenSide) {
      return "You lost!";
    }
    return "You won!";
  }
  
  restart() {
    const newStateGame = {chosenSide: null, showSideSelect: true, winner: null,};
    this.setState(newStateGame);
    this.board.current.restart();
  }
  
  render() {
    return (
      <table>
        <tr>
            <td></td>
            <td><Board ref={this.board} value={this.state.chosenSide} onStateChange={this.getWinner}/></td>
            <td></td>
        </tr>
        <tr>
            <td></td>
            <td className="center">
              <div id="result">
                  <p id="msg">{this.displayWinner()}</p>
              </div>
              {this.state.showSideSelect ? 
              <div id="select-side-section">
                <p>Select your side (X or O):</p>
                <p>
                  {this.createSideSelect('X')}
                  {this.createSideSelect('O')}
                </p>
              </div> 
              : null}
            </td>
            <td></td>
        </tr>
        <tr>
            <td></td>
            <td className="center"><button id="restartButton" className="btn btn-light restart-btn" onClick={this.restart}>Restart</button></td>
            <td></td>
        </tr>
      </table>
    );
  }
 
}

export default App;
