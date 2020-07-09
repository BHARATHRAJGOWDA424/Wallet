const JwtAuthControl = require('./JwtAuthControl');


module.exports = class AuthControlFactory {

    create(){
    
        let authControl = new JwtAuthControl()
        return authControl
        
    }

}