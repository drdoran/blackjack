import React from 'react';
import './App.css';
import Deck from './components/Deck';
import PlayerDeck from './components/PlayerDeck';
import Blackjack from './Blackjack';
import PlayerBet from './components/PlayerBet';
class App extends React.Component {
  constructor(props) {
    super(props);

    this.blackjack = new Blackjack();
    this.blackjack.round.deal();
    this.observe = true;
    var state = this.blackjack.getObserverView();

    this.state = {
      playerTop: state.round.player1Deck,
      playerTopBet: {
        game: state.player1Bet,
        round: state.round.player1Bet
      },
      deck: state.round.deck,
      playerBottom: state.round.player2Deck,
      playerBottomBet: {
        game: state.player2Bet,
        round: state.round.player2Bet
      },
      status: "Press [ENTER] to begin"
    };

    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  // To go into an input manager....
  handleKeyPress(event) {
    if (event.key === 'h') {
      if (!this.observe) {
        if (!this.blackjack.round.canHit()) {
          this.setState({
            status: 'Cannot hit, must stay (j)...'
          });
          return;
        }
        this.blackjack.round.hit();
        var stateHit = this.blackjack.getObserverView();
        var newStatus = 'Presss [Enter] to proceed...';
        if (this.blackjack.round.completed) {
          var player1Win = this.blackjack.round.didPlayer1Win();
          var player2Win = this.blackjack.round.didPlayer2Win();
          if (!(player1Win || player2Win)) {
            newStatus = 'Draw! Press [Enter] to proceed...'
          } else if (player1Win) {
            newStatus = 'Top wins! [Enter] to proceed...'
          } else {
            newStatus = 'Bottom wins! [Enter] to proceed...'
          }
        }

        this.setState({
          playerTop: stateHit.round.player1Deck,
          playerTopBet: {
            game: stateHit.player1Bet,
            round: stateHit.round.player1Bet
          },
          deck: stateHit.round.deck,
          playerBottom: stateHit.round.player2Deck,
          playerBottomBet: {
            game: stateHit.player2Bet,
            round: stateHit.round.player2Bet
          },
          status: newStatus
        });
        this.observe = true;
      }
    } else if (event.key === 'j') {
      if (!this.observe) {
        this.blackjack.round.stay();
        var stateStay = this.blackjack.getObserverView();
        var newStatus = 'Presss [Enter] to proceed...';
        if (this.blackjack.round.completed) {
          var player1Win = this.blackjack.round.didPlayer1Win();
          var player2Win = this.blackjack.round.didPlayer2Win();
          if (!(player1Win || player2Win)) {
            newStatus = 'Draw! Press [Enter] to proceed...'
          } else if (player1Win) {
            newStatus = 'Top wins! [Enter] to proceed...'
          } else {
            newStatus = 'Bottom wins! [Enter] to proceed...'
          }
        }        
        this.setState({
          playerTop: stateStay.round.player1Deck,
          deck: stateStay.round.deck,
          playerBottom: stateStay.round.player2Deck,
          status: newStatus
        });
        this.observe = true;
      }
    } else if (event.key === 'Enter') {
      if (!this.blackjack.round.started) {
        this.blackjack.round.deal();
      }
      if (this.observe && !this.blackjack.round.completed) {
        this.observe = false;
        var state;
        if (this.blackjack.round.player1sTurn) {
          state = this.blackjack.getPlayer1View();
          this.setState({
            playerTop: state.round.player1Deck,
            deck: state.round.deck,
            playerBottom: state.round.player2Deck,
            status: "Top's Turn, hit (h) or stay (j)..."
          });
        } else {
          state = this.blackjack.getPlayer2View();
          this.setState({
            playerTop: state.round.player1Deck,
            playerTopBet: {
              game: state.player1Bet,
              round: state.round.player1Bet
            },
            deck: state.round.deck,
            playerBottom: state.round.player2Deck,
            playerBottomBet: {
              game: state.player2Bet,
              round: state.round.player2Bet
            },
            status: "Bottom's Turn, hit (h) or stay (j)..."
          });
        }
      } else if (this.blackjack.round.completed) {
        this.blackjack.newRound();
        var newRoundState = this.blackjack.getObserverView();
        this.setState({
          playerTop: newRoundState.round.player1Deck,
          playerTopBet: {
            game: newRoundState.player1Bet,
            round: newRoundState.round.player1Bet
          },
          deck: newRoundState.round.deck,
          playerBottom: newRoundState.round.player2Deck,
          playerBottomBet: {
            game: newRoundState.player2Bet,
            round: newRoundState.round.player2Bet
          },
          status: "Press [ENTER] to begin"
        });
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
          <div className="left">
            <PlayerBet bets={ this.state.playerTopBet }/>
            <div className="status">{ this.state.status }</div>
            <PlayerBet bets={ this.state.playerBottomBet }/>
          </div>
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
