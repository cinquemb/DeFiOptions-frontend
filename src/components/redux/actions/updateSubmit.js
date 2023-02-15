const updateSubmit = (isSubmit) => {
    return {
        type: "UPDATE_SUBMIT",
        submit: isSubmit
    }
}

export default updateSubmit;