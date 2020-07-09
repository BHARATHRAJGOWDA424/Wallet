
const HashControlInterface = require('./HashControlInterface');
const bcrypt = require('bcryptjs');
const HttpError = require('standard-http-error')

module.exports = class BcryptHashControl extends HashControlInterface {

    constructor() {
        super();
    }

    async hash(password) {

        try {

            let salt = await bcrypt.genSalt(10)
            let hashedPassword = await bcrypt.hash(password, salt);
            return hashedPassword

        } catch (error) {
            throw new HttpError(500, "InternalServerError");
        }

    }

    async compare(candidatePassword, hashedPassword) {

        try {

            let comparisionResult = await bcrypt.compare(candidatePassword, hashedPassword);
            return comparisionResult;

        } catch (error) {
            return false;
        }

    }

}