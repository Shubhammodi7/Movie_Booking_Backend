const successBody = (data, message = "Request processed successfully") => {
    return {
        success: true,
        message: message,
        data: data
    };
};

const errorBody = (err, message = "Something went wrong") => {
    return {
        success: false,
        message: message,
        err: err
    };
};

module.exports = { successBody, errorBody };