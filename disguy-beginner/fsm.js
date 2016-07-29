// Finite State Machine
// http://wiki.unity3d.com/index.php?title=Finite_State_Machine

// labels for transitions
const Transition = {
  NullTransition: 0,
  FacedEnemy: 1,
  TookRangedDamage: 2,
  IsDying: 3
}

// labels for the states
const StateId = {
  NullStateId: 0,
  Resting: 1,
  Attacking: 2,
  Escaping: 3
}

class FSM {
  constructor () {
    this.a = 0
  }
}

class FSMState {
  constructor () {
    this.map = []
    this.stateId = 0
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
      return t.Id
    }
    return StateId.NullStateId
  }
  /* Virtual methods */
  // DoBeforeEntering () {}
  // DoBeforeLeaving () {}
  // Reason (Warrior) {}
  // Act (Warrior) {}
}

export { Transition, StateId, FSM, FSMState }
