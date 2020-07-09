const BcryptHashControl = require('./BcryptHashControl');


module.exports = class HashControlFactory {

    create() {

        let hashControl = new BcryptHashControl()
        return hashControl

    }

}