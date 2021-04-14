import React from 'react';
import './PlayerBet.css'

class PlayerBet extends React.Component {
   render() {
      var bets = [];
      for (var i = 0; i < this.props.bets.game; ++i) {
         bets.push((<div className="bet-circle expired" />));
      }
      for (var i = 0; i < this.props.bets.round; ++i) {
         bets.push((<div className="bet-circle active" />));
      }
      for (var i = 0; i < (5 - (this.props.bets.game + this.props.bets.round)); ++i) {
         bets.push((<div className="bet-circle inactive" />));
      }

      return (
         <div className="bet-container">
            { bets }
         </div>
      );
   }
}

export default PlayerBet;