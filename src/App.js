import React from 'react';
import './App.css';
import Deck from './components/Deck';
import PlayerDeck from './components/PlayerDeck';
import Blackjack from './Blackjack';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.blackjack = new Blackjack();
    this.observe = true;
    var state = this.blackjack.getObserverView();

    this.state = {
      playerTop: state.player1Deck,
      deck: state.deck,
      playerBottom: state.player2Deck,
      status: "Press [ENTER] to begin"
    };

    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  handleKeyPress(event) {
    if (event.key === 'h') {
      if (!this.observe) {
        this.blackjack.hit();
        var stateHit = this.blackjack.getObserverView();
        this.setState({
          playerTop: stateHit.player1Deck,
          deck: stateHit.deck,
          playerBottom: stateHit.player2Deck,
          status: this.blackjack.completed ? 'Game over!' : 'Press [ENTER] to proceed'
        });
        this.observe = true;
      }
    } else if (event.key === 'j') {
      if (!this.observe) {
        this.blackjack.stay();
        var stateStay = this.blackjack.getObserverView();
        this.setState({
          playerTop: stateStay.player1Deck,
          deck: stateStay.deck,
          playerBottom: stateStay.player2Deck,
          status: this.blackjack.completed ? 'Game over!' : 'Press [ENTER] to proceed'
        });
        this.observe = true;
      }
    } else if (event.key === 'Enter') {
      if (!this.blackjack.started) {
        this.blackjack.deal();
      }
      if (this.observe && !this.blackjack.isComplete()) {
        this.observe = false;
        var state;
        if (this.blackjack.player1sTurnEh()) {
          state = this.blackjack.getPlayer1View();
          this.setState({
            playerTop: state.player1Deck,
            deck: state.deck,
            playerBottom: state.player2Deck,
            status: "Top's Turn, hit (h) or stay (j)..."
          });
        } else {
          state = this.blackjack.getPlayer2View();
          this.setState({
            playerTop: state.player1Deck,
            deck: state.deck,
            playerBottom: state.player2Deck,
            status: "Bottom's Turn, hit (h) or stay (j)..."
          });
        }
      }
    }
  }

  componentDidMount() {
    document.addEventListener("keydown", this.handleKeyPress, false);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeyPress, false);
  }

  render() {

    return (
      <div className="gamearea" onKeyDown={(event) => this.handleKeyPress(event)}>
        <div className="top">
          <PlayerDeck cards={this.state.playerTop} />
        </div>
        <div className="center">
          <div className="status">{ this.state.status }</div>
          <Deck cards={this.state.deck} />
        </div>
        <div className="bottom highlight">
          <PlayerDeck cards={this.state.playerBottom} />
        </div>
      </div>
    );
  }
}

export default App;
