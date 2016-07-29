// test FSMState
/* eslint-disable no-undef */
import {Transition, StateId, FSM, FSMState} from '../fsm'
import { expect } from 'chai'

let fsm
let state
describe('FSMState Test Suite', () => {
  beforeEach(() => {
    state = new FSMState(StateId.Walking)
  })
  it('Adds a new transition, and ignores duplicates', () => {
    state.addTransition(Transition.FacedEnemy, StateId.Attacking)
    state.addTransition(Transition.FacedEnemy, StateId.Attacking)
    expect(state.map.length).to.equal(1)
  })
  it('Deletes a transition', () => {
    state.addTransition(Transition.FacedEnemy, StateId.Attacking)
    expect(state.map.length).to.equal(1)
    state.deleteTransition(Transition.FacedEnemy)
    expect(state.map.length).to.equal(0)
  })
  it('returns an OutPutState', () => {
    state.addTransition(Transition.FacedEnemy, StateId.Attacking)
    expect(state.GetOutputState(Transition.FacedEnemy)).to.equal(StateId.Attacking)
  })
})

describe('FSM System Test Suite', () => {
  beforeEach(() => {
    fsm = new FSM()
    state = new FSMState(StateId.Walking)
  })
  it('Adds a state', () => {
    fsm.addState(state)
    expect(fsm.states.length).to.equal(1)
    expect(fsm.states[0]).to.equal(state)
  })
  it('Deletes a state', () => {
    fsm.addState(state)
    expect(fsm.states.length).to.equal(1)
    fsm.deleteState(state.Id)
    expect(fsm.states.length).to.equal(0)
  })
  it('Performs a transition', () => {
    const state2 = new FSMState(StateId.Attacking)
    state.addTransition(Transition.FacedEnemy, StateId.Attacking)
    state2.addTransition(Transition.KilledEnemy, StateId.Walking)
    fsm.addState(state)
    fsm.addState(state2)
    expect(fsm.states.length).to.equal(2)
    expect(fsm.currentStateId).to.equal(StateId.Walking)
    fsm.performTransition(Transition.FacedEnemy)
    expect(fsm.currentStateId).to.equal(StateId.Attacking)
    expect(fsm.currentState).to.equal(state2)
  })
})
