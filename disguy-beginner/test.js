// test FSMState
/* eslint-disable no-undef */
import {Transition, StateId, FSM, FSMState} from './fsm'
import { expect } from 'chai'


describe('FSM System Test Suite', () => {

})

let state
describe('FSMState Test Suite', () => {
  beforeEach(() => {
    state = new FSMState()
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
