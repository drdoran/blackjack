import './Deck.css';
import React from 'react';
import Card from './Card';

class Deck extends React.Component {
   render() {
      return (
         <div className="deck">
            { this.props.cards.map((card, i) => <Card key={i} value={card.value} faceUp={card.faceUp} />) }
         </div>
      );
   }
}

export default Deck;