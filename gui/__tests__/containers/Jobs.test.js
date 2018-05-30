/* eslint-env jest */
import React from 'react'
import { mount } from 'enzyme'
import { ConnectedJobs as Jobs } from 'containers/Jobs.js'
import jobSpecFactory from 'factories/jobSpec'
import syncFetch from 'test-helpers/syncFetch'
import { Provider } from 'react-redux'
import createStore from 'connectors/redux'
import { decamelizeKeys } from 'humps'

const mountJobs = () => (
  mount(
    <Provider store={createStore()}>
      <Jobs classes={{}} />
    </Provider>
  )
)

describe('containers/Job', () => {
  it('renders the list of jobs', async () => {
    expect.assertions(5)

    const response = jobSpecFactory([{
      id: 'c60b9927eeae43168ddbe92584937b1b',
      initiators: [{'type': 'web'}],
      createdAt: '2018-05-10T00:41:54.531043837Z'
    }])
    global.fetch.getOnce('/v2/specs', response)
    global.fetch.getOnce(
      '/v2/account_balance',
      decamelizeKeys({
        data: {
          attributes: {
            ethBalance: '10120000000000000000000',
            linkBalance: '7460000000000000000000'
          }
        }
      })
    )

    const wrapper = mountJobs()

    await syncFetch(wrapper).then(() => {
      expect(wrapper.text()).toContain('c60b9927eeae43168ddbe92584937b1b')
      expect(wrapper.text()).toContain('web')
      expect(wrapper.text()).toContain('2018-05-10T00:41:54.531043837Z')

      expect(wrapper.text()).toContain('Ethereum10.12k')
      expect(wrapper.text()).toContain('Link7.46k')

      expect(wrapper.text()).toContain('Jobs1')
    })
  })

  xit('displays an error message when the jobs network request fails', async () => {
    expect.assertions(1)

    global.fetch.catch(() => { throw new TypeError('Failed to fetch') })

    const wrapper = mountJobs()

    await syncFetch(wrapper).then(() => {
      expect(wrapper.text()).toContain(
        'There was an error fetching the jobs. Please reload the page.'
      )
    })
  })
})
