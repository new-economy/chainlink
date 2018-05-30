import { RECEIVE_JOBS } from 'actions'

const initialState = {
  items: [],
  count: 0,
  fetchError: false
}

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case RECEIVE_JOBS:
      return Object.assign(
        {},
        state,
        {
          fetchError: false,
          count: action.count
        }
      )
    default:
      return state
  }
}
