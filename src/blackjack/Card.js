class Card {
   withFaceUp(flag) {
      this.faceUp = flag;
      return this;
   }
   withValue(value) {
      this.value = value;
      return this;
   }
}

export default Card;