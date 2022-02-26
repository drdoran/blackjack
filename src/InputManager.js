class InputManager {
   constructor(getGame) {
      this.getGame = getGame;
      this.handleKeyPress = this.handleKeyPress.bind(this);
   }
   handleKeyPress(event) {
      switch (event.key) {
         case 'h': {
            this.getGame().handleHit();
            break;
         }
         case 'j': {
            this.getGame().handleStay();
            break;
         }
         case 'Enter': {
            this.getGame().handleEnter();
            break;
         }
         default: break;
      }
   }
}

export default InputManager;