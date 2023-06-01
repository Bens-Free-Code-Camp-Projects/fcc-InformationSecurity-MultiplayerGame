class Player {
  constructor({x, y, score, id, size = 20}) {
    this.x = x;
    this.y = y;
    this.score = score;
    this.id = id;
    this.size = size;
  }

  movePlayer(dir, speed) {
    const limit = this.size/2
    if(dir.includes('up')){
      if(this.y <= limit + speed + 80){
        this.y = limit + 80
      } else {
        this.y -= speed
      }
    }
    if(dir.includes('down')){
      if(this.y >= 480 - limit - speed) {
        this.y = 480 - limit
      }
      else {this.y += speed}
    }
    if(dir.includes('left')){
      if(this.x <= limit + speed) {
        this.x = limit
      } else {
        this.x -= speed
      }
    } 
    if(dir.includes('right')){
      if(this.x >= 640 - limit - speed) {
        this.x = 640 - limit
      }
      else {this.x += speed}
    }
  }

  collision(item) {
    if(this.x + this.size/2 >= item.x - item.size/2 && this.x - this.size/2 <= item.x + item.size/2){
      if(this.y + this.size/2 >= item.y - item.size/2 && this.y - this.size/2 <= item.y + item.size/2){
        return true
      }
    }
    return false
  }

  calculateRank(arr) {
    let rank = 1
    for (let i = 0; i<arr.length; i++){
      if(this.score < arr[i].score){
        rank += 1
      }
    }
    return `Rank: ${rank}/${arr.length}`
  }
}

export default Player;
