import Blackjack from "./blackjack/Blackjack";

class BlackjackUI {
   constructor() {
      this.playerA = "aaaa";
      this.playerB = "bbbb";
      this.blackjack = new Blackjack();
   }

   getPlayerView(id) {
      var view = {};
      view.players[this.playerA] = {
         "id": this.playerA,
         "loss": this.blackjack.playerA.loss
      }
      view.players[this.playerB] = {
         "id": this.playerB,
         "loss": this.blackjack.playerB.loss
      }

      if (!this.blackjack.completed) {
         var round = {};
         round.players[this.playerA] = {
            "id": this.playerA,
            "bet": this.blackjack.round.playerA.bet,
            "hand": this.blackjack.round.playerA.hand.map((value) => new Card(value))
         }
         round.players[this.playerB] = {
            "id": this.playerB,
            "bet": this.blackjack.round.playerB.bet,
            "hand": this.blackjack.round.playerB.hand.map((value) => new Card(value).withShow(true))
         }

         // Assumes player has a card...
         if (!this.blackjack.round.completed) {
            round.players[this.playerA].hand[0].show = false;
            round.players[this.playerB].hand[0].show = false;
            if (id === this.playerA) {
               round.players[this.playerA].hand[0].peek = true;
            } else if (id === this.playerB) {
               round.players[this.playerB].hand[0].peek = true;
            }
         }

         round.deck = this.blackjack.round.deck.map((value) => new Card().withShow(false));
         round.batter = this.blackjack.round.batter === playerA ? this.playerA : this.playerB;
         view.round = round;
      }

      return view;
   }
}

export default BlackjackUI;