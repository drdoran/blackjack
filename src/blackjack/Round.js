import { Player } from './Constants';
import Card from './Card';

class Round {
   constructor() {
      this.players = {};
      this.players[Player.A] = new RoundPlayer();
      this.players[Player.B] = new RoundPlayer();

      this.deck = [];
      for (var i = 1; i <= 11; ++i) {
         this.deck.push(i);
      }

      // Deal
      this.deck = this.shuffle(this.deck);
      this.players[Player.A].hand.push(this.deck.pop());
      this.players[Player.A].hand.push(this.deck.pop());
      this.players[Player.B].hand.push(this.deck.pop());
      this.players[Player.B].hand.push(this.deck.pop());

      this.batter = Player.A;    // player whose turn it is
      this.loser = null;         // loser of the round, null for draw
      this.completed = false;
   }

   hit() {
      if (this.completed) return;

      if (this.players[this.batter].hand.reduce((a, b) => a + b, 0) < 21) {
         this.players[this.batter].hand.push(this.deck.pop());
         this.players[this.batter].stay = false;
         this.next();
      }
   }

   stay() {
      if (this.completed) return;
      this.players[this.batter].stay = true;
      this.next();
   }

   next() {
      if ((this.players[Player.A].stay && this.players[Player.B].stay) || this.deck.length === 0) {
         this.completed = true;
         this.determineLoser();
      }

      else {
         this.batter = this.batter === Player.A ? Player.B : Player.A;
      }
   }

   determineLoser() {
      var playerATotal = this.players[Player.A].hand.reduce((a, b) => a + b, 0);
      var playerBTotal = this.players[Player.B].hand.reduce((a, b) => a + b, 0);

      // check for busts
      if (playerATotal > 21 || playerBTotal > 21) {
         if (playerATotal <= 21)
            return this.loser = Player.B;

         if (playerBTotal <= 21)
            return this.loser = Player.A;

         // both busted - winner has lowest bust
         if (playerATotal < playerBTotal)
            return this.loser = Player.B;

         if (playerBTotal < playerATotal)
            return this.loser = Player.A;
      }

      // neither busted, winner has highest score
      if (playerATotal > playerBTotal)
         return this.loser = Player.B;

      if (playerBTotal > playerATotal)
         return this.loser = Player.A;

      return this.loser = null; // draw
   }

   toSnapshot(player) {
      var round = {};
      round.players = {};
      round.players[Player.A] = this.players[Player.A].toSnapshot();
      round.players[Player.B] = this.players[Player.B].toSnapshot();

      // Assumes player has a card...
      if (!this.completed) {
         // First card is hidden during round
         round.players[Player.A].hand[0].faceUp = false;
         round.players[Player.B].hand[0].faceUp = false;

         // Only the player should know the value of their hidden card
         if (player === Player.A) {
            delete round.players[Player.B].hand[0].value;
         }
         else if (player === Player.B) {
            delete round.players[Player.A].hand[0].value;
         }
         else {
            delete round.players[Player.A].hand[0].value;
            delete round.players[Player.B].hand[0].value ;

         }
      }

      // Deck is hidden
      round.deck = this.deck.map(() => new Card());
      round.batter = this.batter;
      round.completed = this.completed

      return round;
   }

   // Stolen from a website called StackOverflow
   shuffle(array) {
      var currentIndex = array.length, temporaryValue, randomIndex;

      // While there remain elements to shuffle...
      while (0 !== currentIndex) {

         // Pick a remaining element...
         randomIndex = Math.floor(Math.random() * currentIndex);
         currentIndex -= 1;

         // And swap it with the current element.
         temporaryValue = array[currentIndex];
         array[currentIndex] = array[randomIndex];
         array[randomIndex] = temporaryValue;
      }

      return array;
   }
}

class RoundPlayer {
   constructor() {
      this.hand = [];
      this.bet = 1;
      this.stay = false;
   }

   toSnapshot() {
      return {
         "hand": this.hand.map((value) => new Card().withValue(value).withFaceUp(true)),
         "bet": this.bet
      }
   }
}


export default Round;