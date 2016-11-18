const initialState = {}

export default (state = initialState, action) => {
  if (action.type === 'GOT_PROJECT_ITEM_NAMES') {
    return {
      ...state,
      projectItemNames: action.payload
    }
  }
  return state
}
