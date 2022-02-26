import React from 'react';
import './PlayerBet.css'

class PlayerBet extends React.Component {
   render() {
      let bets = [];
      for (let i = 0; i < this.props.bets.game; ++i) {
         bets.push((<div key={i} className="bet-circle expired" />));
      }
      for (let i = 0; i < this.props.bets.round; ++i) {
         bets.push((<div key={this.props.bets.game + i} className="bet-circle active" />));
      }
      for (let i = 0; i < (5 - (this.props.bets.game + this.props.bets.round)); ++i) {
         bets.push((<div key={this.props.bets.game + this.props.bets.round + i} className="bet-circle inactive" />));
      }

      return (
         <div className="bet-container">
            { bets }
         </div>
      );
   }
}

export default PlayerBet;