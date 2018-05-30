import { RECEIVE_ACCOUNT_BALANCE } from 'actions'

const initialState = {
  eth: '0',
  link: '0'
}

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case RECEIVE_ACCOUNT_BALANCE:
      return Object.assign(
        {},
        state,
        {
          eth: action.eth,
          link: action.link
        }
      )
    default:
      return state
  }
}
