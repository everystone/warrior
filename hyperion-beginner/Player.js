const Transition = {
  NullTransition: 0,
  FacedEnemy: 1,
  TookRangedDamage: 2,
  IsDying: 3,
  KilledEnemy: 4
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
  }
  // Configures the Finite State Machine
  setupFSM () {
    const walk = new WalkState()
    walk.addTransition(Transition.FacedEnemy, StateId.Attacking)
    const attack = new AttackState()
    attack.addTransition(Transition.KilledEnemy, StateId.Walking)

    this.fsm.addState(walk)
    this.fsm.addState(attack)
  }
  playTurn (warrior) {
    this.fsm.currentState.Reason(warrior)
    this.fsm.currentState.Act(warrior)
  }
}

class WalkState extends FSMState {
  constructor () {
    super(StateId.Walking)
  }
  Reason (warrior) {
  }
  Act (warrior) {
    warrior.walk()
  }
}

class AttackState extends FSMState {
  constructor () {
    super(StateId.Attacking)
  }
  DoBeforeEntering () {}
  DoBeforeLeaving () {}
  Reason (warrior) {}
  Act (warrior) {}
}


export default Player
