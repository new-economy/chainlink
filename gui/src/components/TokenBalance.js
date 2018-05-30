import React from 'react'
import PropTypes from 'prop-types'
import MetaInfo from 'components/MetaInfo'
import numeral from 'numeral'
import { BigNumber } from 'bignumber.js'

const WEI_PER_TOKEN = new BigNumber(10 ** 18)

const formatBalance = (val) => {
  const b = new BigNumber(val)
  const tokenBalance = b.dividedBy(WEI_PER_TOKEN).toNumber()

  return numeral(tokenBalance).format('0.20a')
}

const TokenBalance = ({title, value, className}) => (
  <MetaInfo
    title={title}
    value={formatBalance(value)}
    className={className}
  />
)

TokenBalance.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.string,
  className: PropTypes.string
}

export default TokenBalance
