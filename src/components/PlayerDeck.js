import './PlayerDeck.css'
import React from 'react';
import GradientLabel from './GradientLabel';
import Card from './Card';

class PlayerDeck extends React.Component {
   render() {
      if (this.props.cards.length > 0) {
         var label = "";
         if (this.props.cards[0].value != null) {
            var sum = this.props.cards.map((card) => card.value).reduce((a, b) => a + b, 0);
            label = `${sum} / 21`;
         } else if (this.props.cards.length === 1) {
            label = `? / 21`;
         } else {
            var visibleSum = this.props.cards.reduce((a, b) => a + (b.value || 0), 0);
            label = `? + ${visibleSum} / 21`;
         }
         return (
            <div className="player-deck">
               <div className="cards">
               { this.props.cards.map((card, i) => <Card key={i} value={card.value} faceUp={card.faceUp} />) }
               </div>
               <div className="score">
                  <GradientLabel label={label} />
               </div>
            </div>
         );
      }
      return <div className="player-deck"></div>;
   }
}

export default PlayerDeck;