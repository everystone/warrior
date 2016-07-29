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
  rest () { this.lastUsed = 'rest'; this.hp += 2 },
  health () { return this.hp }
}

let player = new Player()
describe('Player Tests', () => {
  beforeEach(() => {
    // player = new Player()
  })
  it('Initializes a FSM with several states', () => {
    expect(player.fsm.states.length).to.be.above(2)
  })
  it('Check if warrior filler still works', () => {
    expect(warrior.feel().isWall()).to.be.false
    expect(warrior.health()).to.equal(20)
  })
  it('Heals after combat', () => {
    player.steps = 2
    // Start in state FacedEnemy
    player.setTransition(Transition.FacedEnemy)
    warrior.hp = 12
    // Because the space next to warrior is empty, he should now heal
    player.playTurn(warrior)
    expect(warrior.lastUsed).to.equal('rest')
    expect(player.fsm.currentStateId).to.equal(StateId.Resting)
  })
  it('Escapes when taking damage while healing', () => {
    warrior.hp = 10 // simulate archer arrow
    let dir = player.dir
    player.playTurn(warrior)
    expect(player.fsm.currentStateId).to.equal(StateId.Escaping)
    expect(warrior.lastUsed).to.equal('walk')
    expect(player.steps).to.equal(1) // swapped
    expect(player.dir).to.not.equal(dir)
  })
  it('Heals after successfull escape', () => {
    player.playTurn(warrior)
    expect(player.fsm.currentStateId).to.equal(StateId.Resting)
    expect(player.hp).to.equal(12)
  })
})
