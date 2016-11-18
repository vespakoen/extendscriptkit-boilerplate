import { evalJsx } from '../utils'

export function getProjectItemNames() {
  return dispatch => {
    evalJsx(`
      var items = []
      app.project.forItems(function (item) {
        items.push(item)
      })
      JSON.stringify(items.map(function (item) { return item.name }))
    `)
    .then(payload => {
      dispatch({
        type: 'GOT_PROJECT_ITEM_NAMES',
        payload: JSON.parse(payload)
      })
    })
  }
}
