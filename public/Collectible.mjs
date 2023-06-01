class Collectible {
  constructor({x=Math.floor(Math.random() * 630) + 5, y = Math.floor(Math.random() * 390) + 85, value = 1, id = 1, size = 5}) {
    this.x = x;
    this.y = y;
    this.value = value;
    this.id = id;
    this.size = size;
  }
}

/*
  Note: Attempt to export this for use
  in server.js
*/
try {
  module.exports = Collectible;
} catch(e) {}

export default Collectible;
