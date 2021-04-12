class Blackjack {
   constructor() {
      this.player1Deck = [];
      this.player2Deck = [];
      this.deck = [];

      for (var i = 1; i <= 11; ++i) {
         this.deck.push(i);
      }

      this.deck = this.shuffle(this.deck);

      // Rough implementation!
      this.started = false;
      this.player1sTurn = true;
      this.completed = false;
      this.player1Stay = false;
      this.player2Stay = false;
   }

   deal() {
      if (this.started) return;
      
      this.player1Deck.push(this.deck.pop());
      this.player1Deck.push(this.deck.pop());
      this.player2Deck.push(this.deck.pop());
      this.player2Deck.push(this.deck.pop());

      this.started = true;
   }

   hit() {
      if (!this.started) return;
      if (this.completed)  return;

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

   getPlayer1View() {
      if (!this.started) {
         return {
            player1Deck: [],
            deck: this.deck.map((card) => new Card()),
            player2Deck: []
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
         deck: deck,
         player2Deck: player2Deck
      }
   }

   getPlayer2View() {
      if (!this.started) {
         return {
            player1Deck: [],
            deck: this.deck.map((card) => new Card()),
            player2Deck: []
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
         deck: deck,
         player2Deck: player2Deck
      }
   }

   getObserverView() {
      if (!this.started) {
         return {
            player1Deck: [],
            deck: this.deck.map((card) => new Card()),
            player2Deck: []
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
         deck: deck,
         player2Deck: player2Deck
      }
   }

   player1sTurnEh() {
      return this.player1sTurn;
   }

   isComplete() {
      return this.completed;
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