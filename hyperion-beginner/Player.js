const Transition = {
  NullTransition: 0,
  FacedEnemy: 1,
  Fallback: 2,
  NeedHealing: 3,
  KilledEnemy: 4,
  DoneHealing: 5
}
const StateId = {
  NullStateId: -1,
  Walking: 0,
  Resting: 1,
  Attacking: 2,
  Recon: 3,
  Escaping: 4
}
class FSM {
  constructor () {
    this.states = []
    this.currentStateId = 0
    this.currentState = {}
  }
  addState (state) {
    // first state is set as active state
    if (this.states.length === 0) {
      this.states.push(state)
      this.currentStateId = state.Id
      this.currentState = state
      return
    }
    // Ignore duplicates
    if (this.states.find((s) => s.Id === state.Id)) {
      return
    }
    this.states.push(state)
  }
  deleteState (id) {
    if (id === StateId.NullStateId) {
      return
    }
    this.states = this.states.filter((s) => s.Id !== id)
  }
  /*
  * This method performs the transition from current State to next state, based on transition
  */
  performTransition (trans) {
    if (trans === Transition.NullTransition) {
      return
    }
    const id = this.currentState.GetOutputState(trans)
    if (id === StateId.NullStateId) {
      return
    }
    // Update currentState
    this.currentStateId = id
    const state = this.states.find((s) => s.Id === id)
    if (state !== undefined) {
      // Post processing of old state
      this.currentState.DoBeforeLeaving()
      this.currentState = state
      // Reset the state to its desired condition before it can reason or act
      this.currentState.DoBeforeEntering()
    }
  }
}
class FSMState {
  constructor (stateId) {
    this.map = []
    this.Id = stateId
  }
  addTransition (trans, id) {
    if (trans === Transition.NullTransition) {
      return
    }
    if (id === StateId.NullStateId) {
      return
    }
    // check if transition is already in map
    if (this.map.find((t) => t.Id === id)) {
      console.log(`id: ${id} exists`)
    } else {
      this.map.push({
        Id: id,
        Transition: trans
      })
      // console.log(`Added new transition: ${id}, ${trans}`)
    }
  }
  deleteTransition (trans) {
    if (trans === Transition.NullTransition) {
      return
    }
    // if (this.map.find((t) => t.Transition === trans)) {
    // }
    this.map = this.map.filter((t) => t.Transition !== trans)
  }
  // Returns the new state based on transition
  GetOutputState (trans) {
    const t = this.map.find((t) => t.Transition === trans)
    if (t !== undefined) {
      return t.Id // state id
    }
    return StateId.NullStateId
  }
  /* Virtual methods */
  DoBeforeEntering () {}
  DoBeforeLeaving () {}
  Reason (Warrior) {}
  Act (Warrior) {}
}
class Player {
  constructor () {
    this.fsm = new FSM()
    this.setupFSM()
    this.hp = 20
    this.dir = 'forward'
    this.steps = 0
    this.pivoted = false
  }
  setTransition (trans) {
    this.fsm.performTransition(trans)
    // console.log(`Transitioning: ${trans}`)
  }
  step () {
    this.steps += 1
  }
  swap (resetSteps) {
    this.dir = this.dir === 'forward' ? 'backward' : 'forward'
    // warrior.pivot()
    if (resetSteps) {
      this.steps = 0
    }
  }
  setupFSM () {
    const walking = new WalkState()
    walking.addTransition(Transition.FacedEnemy, StateId.Attacking)
    

    const attacking = new AttackState()
    attacking.addTransition(Transition.KilledEnemy, StateId.Walking)
    attacking.addTransition(Transition.NeedHealing, StateId.Resting)
    const resting = new RestState()
    resting.addTransition(Transition.DoneHealing, StateId.Walking)
    resting.addTransition(Transition.Fallback, StateId.Escaping)
    const escaping = new EscapeState()
    escaping.addTransition(Transition.NeedHealing, StateId.Resting)

    this.fsm.addState(walking)
    this.fsm.addState(attacking)
    this.fsm.addState(resting)
    this.fsm.addState(escaping)
  }
  playTurn (warrior) {
    this.fsm.currentState.Reason(warrior, this)
    this.fsm.currentState.Act(warrior, this)
    this.hp = warrior.health()
  }
}

class WalkState extends FSMState {
  constructor () {
    super(StateId.Walking)
  }
  Reason (warrior, player) {
    if (warrior.feel(player.dir).isEnemy()) {
      player.setTransition(Transition.FacedEnemy)
    }
  }
  Act (warrior, player) {
    if (warrior.feel(player.dir).isCaptive()) {
      warrior.rescue(player.dir)
      return
    }
    if (warrior.feel(player.dir).isWall()) {
      player.swap(true)
    }
    warrior.walk(player.dir)
    player.step()
  }
}

class AttackState extends FSMState {
  constructor () {
    super(StateId.Attacking)
  }
  Reason (warrior, player) {
    if (warrior.feel(player.dir).isEmpty()) {
      // check health
      if (warrior.health() <= 13) {
        player.setTransition(Transition.NeedHealing)
        return
      }
      player.setTransition(Transition.KilledEnemy)
    }
  }
  Act (warrior, player) {
    if ((player.dir === 'backward' && !player.pivoted) || (player.dir === 'forward' && player.pivoted)) {
      warrior.pivot()
      player.swap(false)
    } else {
      warrior.attack(player.dir)
    }
  }
}
class RestState extends FSMState {
  constructor () {
    super(StateId.Resting)
  }
  Reason (warrior, player) {
    if (warrior.health() < player.hp) {
      // We have taken damage since last turn, most likely pesky rangers
      // if we have less than 13 hp and there is room to escape
      if (warrior.health() <= 10 && player.steps >= 1) {
        player.setTransition(Transition.Fallback) // go back one step and heal
      } else {
        player.setTransition(Transition.DoneHealing) // charge
      }
    }
    if (warrior.health() >= 16) {
      player.setTransition(Transition.DoneHealing)
    }
  }
  Act (warrior, player) {
    warrior.rest()
  }
}
// Invoked after taking ranged damage
// This state checks health, and if we have enough we attack, or else we fallback.
class EscapeState extends FSMState {
  constructor () {
    super(StateId.Escaping)
    this.swapped = false
    this.player = {}
  }
  Reason (warrior, player) {
    if (warrior.health() >= player.hp) {
      // we have not taken damage since last turn, safe to stop and heal
      player.setTransition(Transition.NeedHealing)
      return
    }
  }
  Act (warrior, player) {
    if (!this.swapped) {
      player.swap(true)
      this.player = player
      this.swapped = true
    }
    warrior.walk(player.dir)
    player.step()
  }
  DoBeforeEntering () {
    this.swapped = false
  }
  DoBeforeLeaving () {
    // Swap back
    if (this.swapped) {
      this.player.swap(true)
    }
  }
}

export { Player, Transition, StateId }
