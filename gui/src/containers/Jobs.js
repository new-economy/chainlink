import React, { Component } from 'react'
import PropType from 'prop-types'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import JobList from 'components/JobList'
import TokenBalance from 'components/TokenBalance'
import MetaInfo from 'components/MetaInfo'
import { withSiteData } from 'react-static'
import { withStyles } from '@material-ui/core/styles'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchJobs, fetchAccountBalance } from 'actions'

const styles = theme => ({
  title: {
    marginTop: theme.spacing.unit * 5,
    marginBottom: theme.spacing.unit * 5
  }
})

export class Jobs extends Component {
  componentDidMount () {
    this.props.fetchJobs()
    this.props.fetchAccountBalance()
  }

  render () {
    const {classes, jobCount, ethBalance, linkBalance} = this.props

    return (
      <div>
        <Typography variant='display2' color='inherit' className={classes.title}>
          Jobs
        </Typography>

        <Grid container spacing={40}>
          <Grid item xs={9}>
            <JobList />
          </Grid>
          <Grid item xs={3}>
            <Grid container spacing={24}>
              <Grid item xs={12}>
                <TokenBalance title='Ethereum' value={ethBalance} />
              </Grid>
              <Grid item xs={12}>
                <TokenBalance title='Link' value={linkBalance} />
              </Grid>
              <Grid item xs={12}>
                <MetaInfo title='Jobs' value={jobCount} />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>
    )
  }
}

Jobs.propTypes = {
  classes: PropType.object.isRequired,
  jobCount: PropType.number.isRequired,
  ethBalance: PropType.string.isRequired,
  linkBalance: PropType.string.isRequired
}

const mapStateToProps = state => ({
  ethBalance: state.accountBalance.eth,
  linkBalance: state.accountBalance.link,
  jobCount: state.jobs.count
})

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    fetchAccountBalance,
    fetchJobs
  }, dispatch)
}

export const ConnectedJobs = connect(mapStateToProps, mapDispatchToProps)(Jobs)

export default withSiteData(
  withStyles(styles)(ConnectedJobs)
)
