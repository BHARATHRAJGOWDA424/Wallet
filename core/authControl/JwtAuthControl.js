
const AuthControlInterface = require('./AuthControlInterface');
const jwt = require('jsonwebtoken');
const HttpError = require('standard-http-error')

module.exports = class JwtAuthControl extends AuthControlInterface {

    constructor() {
        super();
    }

    sign(valueToEncode, secret, options = null) {

        try {

            let token = jwt.sign({"payload" : valueToEncode}, secret, options);
            return token

        } catch (error) {

            throw new HttpError(500, "InternalServerError");
        }

    }

    decode(token, secret) {

        try {

            let decoded = jwt.verify(token, secret);
            return decoded.payload;

        } catch (error) {
            throw new HttpError(401, "Unauthorized");
        }

    }


    decodeRequestHeader(req, secret) {

        try {

            let token = req.headers.authorization;
            return this.decode(token, secret);
            
        } catch (error) {

            throw new HttpError(401, "Unauthorized");
        }
    }

}