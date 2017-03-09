import { evalJsx } from '../utils'

export function getAppProperties() {
  return dispatch => {
    evalJsx('Object.keys(app)')
      .then(payload => {
        dispatch({
          type: 'GOT_APP_PROPERTIES',
          payload: payload.split(',')
        })
      })
  }
}
