const prompts = require('prompts');
const Blackjack = require('./blackjack/Blackjack')

let blackjack;
game = async () => {
   blackjack = new Blackjack();
   
}

(async () => {

   const response = await prompts({
      type: 'confirm',
      name: 'start',
      message: 'Are you ready to start?'
   })

   if (response.start) {
      game();
   } else {
      console.log("goodbye!");z
   }
})();