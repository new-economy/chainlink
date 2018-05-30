import {
  getAccountBalance,
  getJobs
} from 'api'

export const REQUEST_JOBS = 'REQUEST_JOBS'
export const RECEIVE_JOBS = 'RECEIVE_JOBS'

const requestJobs = () => ({ type: REQUEST_JOBS })
const receiveJobs = (json) => {
  return {
    type: RECEIVE_JOBS,
    count: json.meta.count,
    items: json.data.map((j) => (
      {
        id: j.id,
        createdAt: j.attributes.createdAt,
        initiators: j.attributes.initiators
      }
    ))
  }
}

export const fetchJobs = () => {
  return dispatch => {
    dispatch(requestJobs())
    return getJobs()
      .then(json => dispatch(receiveJobs(json)))
  }
}

export const REQUEST_ACCOUNT_BALANCE = 'REQUEST_ACCOUNT_BALANCE'
export const RECEIVE_ACCOUNT_BALANCE = 'RECEIVE_ACCOUNT_BALANCE'

const requestAccountBalance = () => ({ type: REQUEST_ACCOUNT_BALANCE })
const receiveAccountBalance = (json) => {
  return {
    type: RECEIVE_ACCOUNT_BALANCE,
    eth: json.data.attributes.ethBalance,
    link: json.data.attributes.linkBalance
  }
}

export const fetchAccountBalance = () => {
  return dispatch => {
    dispatch(requestAccountBalance())
    return getAccountBalance()
      .then(json => dispatch(receiveAccountBalance(json)))
  }
}
