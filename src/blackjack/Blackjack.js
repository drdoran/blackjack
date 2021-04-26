import { Player } from './Constants';
import Round from './Round';

class Blackjack {
   constructor() {
      this.players = {};
      this.players[Player.A] = new BlackjackPlayer();
      this.players[Player.B] = new BlackjackPlayer();

      this.currentBet = 1;
      this.maxLoss = 5;
      this.completed = false;

      this.round = new Round();
      this.history = [];
   }

   hit() {
      this.round.hit();
      this.next();
   }

   stay() {
      this.round.stay();
      this.next();
   }

   next() {
      if (this.round.completed) {
         switch (this.round.loser) {
            case Player.A:
               this.players[Player.A].loss += this.round.players[Player.A].bet;
               break;
            case Player.B:
               this.players[Player.B].loss += this.round.players[Player.B].bet;
               break;
            default:
               //draw;
               break;
         }

         this.history.push(this.round);
         this.round = null;
         if (this.players[Player.A].loss >= this.maxLoss || this.players[Player.B].loss >= this.maxLoss) {
            this.completed = true;
         } else {
            this.round = new Round();
         }
      }
   }

   toSnapshot(player) {
      var players = {};
      players[Player.A] = { "loss": this.players[Player.A].loss };
      players[Player.B] = { "loss": this.players[Player.B].loss };
      return {
         "players": players,
         "maxLoss": this.maxLoss,
         "completed": this.completed,
         "round": this.round?.toSnapshot(player)
      }
   }
}

class BlackjackPlayer {
   constructor() {
      this.loss = 0;
   }
}

export default Blackjack;