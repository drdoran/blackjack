import React from 'react';
import './Card.css';
import GradientLabel from './GradientLabel'

class Card extends React.Component {
   render() {
      if (this.props.faceUp) {
         return (
            <div className='card front' key={this.props.value} >
               <div>{this.props.value}</div>
            </div>
         );
      } else if (this.props.value) {
         return (
            <div className='card back' key={this.props.value}>
               <GradientLabel label={this.props.value} />
            </div>
         );
      } else {
         return (
            <div className='card back' key={this.props.value} ><div></div></div>
         );
      }
   }
}

export default Card;