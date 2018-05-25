import { parse as parseQueryString } from 'query-string'
import url from 'url'
import { camelizeKeys } from 'humps'
import 'isomorphic-unfetch'

const HOSTNAME = global.location.hostname
const DEFAULT_CHAINLINK_PORT = 6688
const PORT = parseQueryString(global.location.search).port || process.env.CHAINLINK_PORT || DEFAULT_CHAINLINK_PORT

const formatUrl = (path) => (
  url.format({
    hostname: HOSTNAME,
    port: PORT,
    pathname: path
  })
)

export const getJobs = () => {
  const requestUrl = formatUrl('/v2/specs')

  return global.fetch(requestUrl, {credentials: 'include'})
    .then(response => response.json())
    .then((data) => camelizeKeys(data))
}

export const getAccountBalance = () => {
  const requestUrl = formatUrl('/v2/account_balance')

  return global.fetch(requestUrl, {credentials: 'include'})
    .then(response => response.json())
    .then((data) => camelizeKeys(data))
}
