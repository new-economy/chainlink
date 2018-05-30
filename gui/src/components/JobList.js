import React from 'react'
import PropTypes from 'prop-types'
import Card from '@material-ui/core/Card'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import { connect } from 'react-redux'

const formatInitiators = (initiators) => (initiators.map(i => i.type).join(', '))

const renderJobs = (jobs, fetchError) => {
  if (fetchError) {
    return (
      <TableRow>
        <TableCell component='th' scope='row' colSpan={3}>
            There was an error fetching the jobs. Please reload the page.
        </TableCell>
      </TableRow>
    )
  } else {
    return jobs.map(j => (
      <TableRow key={j.id}>
        <TableCell component='th' scope='row'>
          {j.id}
        </TableCell>
        <TableCell>{j.createdAt}</TableCell>
        <TableCell>
          {formatInitiators(j.initiators)}
        </TableCell>
      </TableRow>
    ))
  }
}

export const JobList = ({jobs, fetchError}) => (
  <Card>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>ID</TableCell>
          <TableCell>Created</TableCell>
          <TableCell>Initiator</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {renderJobs(jobs, fetchError)}
      </TableBody>
    </Table>
  </Card>
)

JobList.propTypes = {
  jobs: PropTypes.array.isRequired,
  fetchError: PropTypes.bool.isRequired
}

const mapStateToProps = (state, ownProps) => {
  return {
    jobs: state.jobs.items,
    fetchError: state.jobs.fetchError
  }
}

export default connect(
  mapStateToProps
)(JobList)
