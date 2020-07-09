
module.exports = class UserCaseInterface {

    constructor() {
        if (this.validate === undefined) {
            throw new TypeError("Concrete UserCaseInterface must implement -validate");
        }
        if (this.execute === undefined) {
            throw new TypeError("Concrete UserCaseInterface must implement -execute");
        }

        if (this.executeAndHandleErrors === undefined) {
            throw new TypeError("Concrete UserCaseInterface must implement -executeAndHandleErrors");
        }

    }

}