const isSubmit = (state = "", action) => {
  switch (action.type) {
    case 'UPDATE_SUBMIT':
      return action.submit
    default:
      return state;
  }
}

export default isSubmit;