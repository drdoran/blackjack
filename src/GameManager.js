import BlackjackTable from "./BlackjackTable";
import React from 'react';

class GameManager extends React.Component {
   constructor(props) {
      super(props);
   }

   render() {
      return (<div className='gamemanager'>
         <BlackjackTable />
      </div>)
   }
}

export default GameManager;