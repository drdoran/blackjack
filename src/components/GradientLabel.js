import React from 'react';
import './GradientLabel.css'

class GradientLabel extends React.Component {
   render() {
      return (
         <div className="gradient-label">
            <div className="gradient-label-left"></div>
            <div className="gradient-label-center">{this.props.label}</div>
            <div className="gradient-label-right"></div>
         </div>
      )
   }
}

export default GradientLabel;