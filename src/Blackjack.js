/*

Blackjack States
* New Game
* Players turn
* Next players turn
* game over
* Rounds



*/
class Blackjack {
   constructor() {
      this.currentBet = 1;
      this.round = new Round({
         player1sTurn: Math.round(Math.random()) > 0,
         startingBet: this.currentBet
      });

      this.maxBet = 5;
      this.completed = false;
      this.player1Bet = 0;
      this.player2Bet = 0;
   }

   newRound() {
      if (this.round.didPlayer1Win() && !this.round.didPlayer2Win()) {
         this.player2Bet += this.round.player2Bet;
      } else if (this.round.didPlayer2Win() && !this.round.didPlayer1Win()) {
         this.player1Bet += this.round.player1Bet;
      }

      this.round = new Round({
         player1sTurn: this.round.didPlayer2Win(),
         startingBet: ++this.currentBet
      });
   }

   getPlayer1View() {
      return {
         player1Bet: this.player1Bet,
         player2Bet: this.player2Bet,
         round: this.round.getPlayer1View()
      };
   }

   getPlayer2View() {
      return {
         player1Bet: this.player1Bet,
         player2Bet: this.player2Bet,
         round: this.round.getPlayer2View()
      };
   }

   getObserverView() {
      return {
         player1Bet: this.player1Bet,
         player2Bet: this.player2Bet,
         round: this.round.getObserverView()
      };
   }
}

class Round {
   constructor(options) {
      this.player1Deck = [];
      this.player2Deck = [];
      this.deck = [];

      for (var i = 1; i <= 11; ++i) {
         this.deck.push(i);
      }

      this.deck = this.shuffle(this.deck);

      // Rough implementation!
      this.started = false;
      this.player1sTurn = options?.player1sTurn || true;
      this.completed = false;
      this.player1Stay = false;
      this.player2Stay = false;

      this.player1Bet = options?.startingBet || 1;
      this.player2Bet = options?.startingBet || 1;
   }

   deal() {
      if (this.started) return;

      this.player1Deck.push(this.deck.pop());
      this.player1Deck.push(this.deck.pop());
      this.player2Deck.push(this.deck.pop());
      this.player2Deck.push(this.deck.pop());

      this.started = true;
   }

   canHit() {
      return (this.player1sTurn ? this.player1Deck : this.player2Deck).reduce((a, b) => a + b, 0) < 21
   }

   hit() {
      if (!this.started) return;
      if (this.completed) return;

      // can the player hit?
      var player = this.player1sTurn ? this.player1Deck : this.player2Deck;
      if (player.reduce((a, b) => a + b, 0) < 21) {
         player.push(this.deck.pop());
      }

      this.player1Stay = this.player1sTurn ? false : this.player1Stay;
      this.player2Stay = !this.player1sTurn ? false : this.player2Stay;

      this.next();
   }

   stay() {
      if (!this.started || this.completed) return;

      this.player1Stay = this.player1sTurn ? true : this.player1Stay;
      this.player2Stay = !this.player1sTurn ? true : this.player2Stay;

      this.next();
   }

   next() {
      if ((this.player1Stay && this.player2Stay) || this.deck.length === 0) {
         this.completed = true;
      }

      else {
         this.player1sTurn = !this.player1sTurn;
      }
   }

   didPlayer1Win() {
      if (!this.completed) return;

      var player1Total = this.player1Deck.reduce((a, b) => a + b, 0);
      var player2Total = this.player2Deck.reduce((a, b) => a + b, 0);


      // check for busts
      if (player1Total > 21 || player2Total > 21) {
         if (player1Total <= 21)
            return true;

         if (player2Total <= 21)
            return false;

         // both busted
         return player1Total < player2Total;
      }

      // neither busted, winner has highest score
      if (player1Total > player2Total)
         return true;

      if (player2Total >  player1Total)
         return false;

      return false; // draw

      // need a better way to identify players ;p
   }

   didPlayer2Win() {
      if (!this.completed) return;

      var player1Total = this.player1Deck.reduce((a, b) => a + b, 0);
      var player2Total = this.player2Deck.reduce((a, b) => a + b, 0);


      // check for busts
      if (player1Total > 21 || player2Total > 21) {
         if (player1Total <= 21)
            return false;

         if (player2Total <= 21)
            return true;

         // both busted
         return player2Total < player1Total;
      }

      // neither busted, winner has highest score
      if (player1Total > player2Total)
         return false;

      if (player2Total >  player1Total)
         return true;

      return false; // draw

      // need a better way to identify players ;p
   }

   getPlayer1View() {
      if (!this.started) {
         return {
            player1Deck: [],
            player1Bet: this.player1Bet,
            deck: this.deck.map((card) => new Card()),
            player2Deck: [],
            player2Bet: this.player2Bet,
         };
      }
      // Deck but not sharing deck card values...
      var deck = this.deck.map((card) => new Card());

      var player1Deck = this.player1Deck.map((card) => new Card(card).withShow(true));
      if (!this.completed) {
         player1Deck[0].show = false;
         player1Deck[0].peek = true;
      }

      var player2Deck = this.player2Deck.map((card) => new Card(card).withShow(true));
      if (!this.completed) {
         player2Deck[0].show = false;
         player2Deck[0].value = 0;
      }

      return {
         player1Deck: player1Deck,
         player1Bet: this.player1Bet,
         deck: deck,
         player2Deck: player2Deck,
         player2Bet: this.player2Bet,

      }
   }

   getPlayer2View() {
      if (!this.started) {
         return {
            player1Deck: [],
            player1Bet: this.player1Bet,
            deck: this.deck.map((card) => new Card()),
            player2Deck: [],
            player2Bet: this.player2Bet
         };
      }
      // Deck but not sharing deck card values...
      var deck = this.deck.map((card) => new Card());

      var player2Deck = this.player2Deck.map((card) => new Card(card).withShow(true));
      if (!this.completed) {
         player2Deck[0].show = false;
         player2Deck[0].peek = true;
      }

      var player1Deck = this.player1Deck.map((card) => new Card(card).withShow(true));
      if (!this.completed) {
         player1Deck[0].show = false;
         player1Deck[0].value = 0;
      }
      return {
         player1Deck: player1Deck,
         player1Bet: this.player1Bet,
         deck: deck,
         player2Deck: player2Deck,
         player2Bet: this.player2Bet
      }
   }

   getObserverView() {
      if (!this.started) {
         return {
            player1Deck: [],
            player1Bet: this.player1Bet,
            deck: this.deck.map((card) => new Card()),
            player2Deck: [],
            player2Bet: this.player2Bet,
         };
      }
      // Deck but not sharing deck card values...
      var deck = this.deck.map((card) => new Card());

      var player2Deck = this.player2Deck.map((card) => new Card(card).withShow(true));
      if (!this.completed) {
         player2Deck[0].show = false;
         player2Deck[0].value = 0;
      }
      var player1Deck = this.player1Deck.map((card) => new Card(card).withShow(true));
      if (!this.completed) {
         player1Deck[0].show = false;
         player1Deck[0].value = 0;
      }
      return {
         player1Deck: player1Deck,
         player1Bet: this.player1Bet,
         deck: deck,
         player2Deck: player2Deck,
         player2Bet: this.player2Bet,
      }
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

class Card {
   constructor(value) {
      this.value = value;
      this.show = false;
      this.peek = false;
   }
   withShow(flag) {
      this.show = flag;
      return this;
   }
   withPeak(flag) {
      this.peek = flag;
   }
   withValue(value) {
      this.value = value;
   }
}

export default Blackjack;