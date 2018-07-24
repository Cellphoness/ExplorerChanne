const paramCheck = (params, res) => {
    for (const key in params) {
        if (params.hasOwnProperty(key)) {
            const element = params[key];
            if (element === undefined || element === null || element.length === 0) {
                if (res) {
                    res.send({success:0, msg:'parameter: ' +  key + ' can not be null'})
                }
                return false
            }
        }
    }
    return true
}

module.exports = paramCheck