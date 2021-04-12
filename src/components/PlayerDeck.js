import './PlayerDeck.css'
import React from 'react';
import GradientLabel from './GradientLabel';
import Card from './Card';

class PlayerDeck extends React.Component {
   render() {
      if (this.props.cards.length > 0) {
         var label = "";
         if (this.props.cards[0].show || this.props.cards[0].peek) {
            var sum = this.props.cards.map((card) => card.value).reduce((a, b) => a + b, 0);
            label = `${sum} / 21`;
         } else if (this.props.cards.length === 1) {
            label = `? / 21`;
         } else {
            var visibleSum = this.props.cards.map((card) => (card.show || card.peek) ? card.value : 0).reduce((a, b) => a + b, 0);
            label = `? + ${visibleSum} / 21`;
         }
         return (
            <div className="player-deck">
               <div className="cards">
               { this.props.cards.map((card, i) => <Card key={i} value={card.value} show={card.show} peek={card.peek} />) }
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