const initialState = {}

export default (state = initialState, action) => {
  if (action.type === 'GOT_APP_PROPERTIES') {
    return {
      ...state,
      appProperties: action.payload
    }
  }
  return state
}
