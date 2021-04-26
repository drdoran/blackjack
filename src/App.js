import React from 'react';
import './App.css';
import Deck from './components/Deck';
import PlayerDeck from './components/PlayerDeck';
import Blackjack from './blackjack/Blackjack';
import PlayerBet from './components/PlayerBet';
import { Player } from './blackjack/Constants';
class App extends React.Component {
  constructor(props) {
    super(props);

    this.blackjack = new Blackjack();
    this.observe = true;
    var state = this.blackjack.toSnapshot();

    this.state = {
      playerTop: state.round.players[Player.A].hand,
      playerTopBet: {
        game: state.players[Player.A].loss,
        round: state.round.players[Player.A].bet
      },
      deck: state.round.deck,
      playerBottom: state.round.players[Player.B].hand,
      playerBottomBet: {
        game: state.players[Player.B].loss,
        round: state.round.players[Player.B].bet
      },
      status: "Press [ENTER] to begin"
    };

    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  // To go into an input manager....
  handleKeyPress(event) {
    if (event.key === 'h') {
      if (!this.observe) {
        if (!this.canHit()) {
          this.setState({
            status: 'Cannot hit, must stay (j)...'
          });
          return;
        }
        var round = this.blackjack.round;
        this.blackjack.hit();
        var newStatus = 'Presss [Enter] to proceed...';
        if (round.completed) {
          var loser = this.blackjack.round.loser;
          if (loser === null) {
            newStatus = 'Draw! Press [Enter] to proceed...'
          } else if (loser === Player.A) {
            newStatus = 'Top wins! [Enter] to proceed...'
          } else {
            newStatus = 'Bottom wins! [Enter] to proceed...'
          }
        }

        var stateHit = this.blackjack.toSnapshot();

        this.setState({
          playerTop: stateHit.round.players[Player.A].hand,
          playerTopBet: {
            game: stateHit.players[Player.A].loss,
            round: stateHit.round.players[Player.A].bet
          },
          deck: stateHit.round.deck,
          playerBottom: stateHit.round.players[Player.B].hand,
          playerBottomBet: {
            game: stateHit.players[Player.B].loss,
            round: stateHit.round.players[Player.B].bet
          },
          status: newStatus
        });
        this.observe = true;
      }
    } else if (event.key === 'j') {
      if (!this.observe) {
        var round = this.blackjack.round;
        this.blackjack.stay();
        var newStatus = 'Presss [Enter] to proceed...';
        if (round.completed) {
          var loser = round.loser;
          if (loser === null) {
            newStatus = 'Draw! Press [Enter] to proceed...'
          } else if (loser === Player.B) {
            newStatus = 'Top wins! [Enter] to proceed...'
          } else {
            newStatus = 'Bottom wins! [Enter] to proceed...'
          }
          var results = round.toSnapshot();
          var stayState = this.blackjack.toSnapshot();
          this.setState({
            playerTop: results.players[Player.A].hand,
            playerTopBet: {
              game: stayState.players[Player.A].loss,
              round: 0
            },
            playerBottom: results.players[Player.B].hand,
            playerBottomBet: {
              game: stayState.players[Player.B].loss,
              round: 0
            },
          });
        }
        this.setState({
          status: newStatus
        });
        this.observe = true;
      }
    } else if (event.key === 'Enter') {
      if (this.observe && !this.blackjack.completed) {
        this.observe = false;
        var state;
        var status;
        if (this.blackjack.round.batter === Player.A) {
          state = this.blackjack.toSnapshot(Player.A);
          status = "Top's Turn, hit (h) or stay (j)...";
        } else {
          state = this.blackjack.toSnapshot(Player.B);
          status = "Bottom's Turn, hit (h) or stay (j)...";
        }
        this.setState({
          playerTop: state.round.players[Player.A].hand,
          playerTopBet: {
            game: state.players[Player.A].loss,
            round: state.round.players[Player.A].bet
          },         
          deck: state.round.deck,
          playerBottom: state.round.players[Player.B].hand,
          playerBottomBet: {
            game: state.players[Player.B].loss,
            round: state.round.players[Player.B].bet
          },
          status: status
        });

      } else if (this.blackjack.completed) {
        this.setState({
          status: "GAME OVER"
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

  canHit() {
    return this.blackjack.round.players[this.blackjack.round.batter].hand.reduce((a, b) => (a.value || 0) + (b.value || 0), 0) < 21;
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
