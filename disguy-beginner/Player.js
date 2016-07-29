class Player {
  constructor () {
    this.numTurn = 0
    this.enemiesLeft = 3
    this.healToValue = 13
    this.dir = 'backward'
    this.inCombat = false
    this.hp = 20
  }

  changeDir () {
    if (this.dir === 'backward') {
      this.dir = 'forward'
    } else {
      this.dir = 'backward'
    }
  }

  handleTurn (state) {
    switch(state) {
      
    }
  }

  playTurn (warrior) {
    // check for nearby stuff
    if (warrior.feel(this.dir).isEmpty()) {
      // check if we where in combat
      if (this.inCombat) {
        this.enemiesLeft--
        this.inCombat = false
      } else {
       // we might get attacked by archers
        if (warrior.health() < this.hp) {
          this.inCombat = true
        }
      }

      // check hp
      if (warrior.health() <= this.healToValue && this.enemiesLeft > 0 && !this.inCombat) {
        warrior.rest() // async?
        this.hp = warrior.health()
      } else {
        warrior.walk(this.dir)
      }
    } else if (warrior.feel(this.dir).isWall()) {
      this.changeDir()
      warrior.walk(this.dir)
    } else if (warrior.feel(this.dir).isWarrior()) {
    } else if (warrior.feel(this.dir).isPlayer()) {

    } else if (warrior.feel(this.dir).isCaptive()) {
      warrior.rescue(this.dir)
    } else if (warrior.feel(this.dir).isEnemy()) {
      this.inCombat = true
      warrior.attack(this.dir)
      this.hp = warrior.health()
    }
    this.numTurn++
  }
}


export default Player
