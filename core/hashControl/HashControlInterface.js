
module.exports = class HashContolInterface {

    constructor() {
        if (this.hash === undefined) {
            throw new TypeError("Concrete HashContolInterface must implement -hash");
        }
        if (this.compare === undefined) {
            throw new TypeError("Concrete HashContolInterface must implement -compare");
        }
    }

}