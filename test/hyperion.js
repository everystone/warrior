/* eslint-disable no-undef */
import { Player, Transition, StateId } from '../hyperion-beginner/Player'
import { expect } from 'chai'

// dirty fill for warrior object
const warrior = {
  hp: 20,
  lastUsed: '',
  feel () {
    return {
      isWall () { return false },
      isEnemy () { return false },
      isCaptive () { return false },
      isEmpty () { return true }
    }
  },
  walk () { this.lastUsed = 'walk' },
  attack () { this.lastUsed = 'attack' },
  rescue () { this.lastUsed = 'rescue' },
  rest () { this.lastUsed = 'rest' },
  health () { return this.hp }
}

let player
describe('Player test suite', () => {
  beforeEach(() => {
    player = new Player()
  })
  it('Initializes a FSM with several states', () => {
    expect(player.fsm.states.length).to.be.above(2)
  })
  it('Check if warrior filler still works', () => {
    expect(warrior.feel().isWall()).to.be.false
    expect(warrior.health()).to.equal(20)
  })
  it('Falls back after taking damage in RestState', () => {
    let dir = player.dir
    player.steps = 2
    player.setTransition(Transition.FacedEnemy)
    warrior.hp = 12
    
    player.playTurn(warrior)
    expect(warrior.lastUsed).to.equal('rest')
    expect(player.fsm.currentStateId).to.equal(StateId.Resting)
    warrior.hp = 10
    
    player.playTurn(warrior)
    expect(player.fsm.currentStateId).to.equal(StateId.Escaping)
    expect(warrior.lastUsed).to.equal('walk')
    expect(player.steps).to.equal(1) // swapped
    expect(player.dir).to.not.equal(dir)
    
    warrior.hp = 9
    player.playTurn(warrior)
    expect(player.fsm.currentStateId).to.equal(StateId.Escaping)
    expect(player.steps).to.equal(2)


    

  })
})
