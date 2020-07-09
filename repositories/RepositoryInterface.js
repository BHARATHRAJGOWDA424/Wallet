
module.exports = class RepositoryInterface {
    constructor() {

        if (this.model === undefined) {
            throw new TypeError("Concrete RepositoryInterface must implement -model");
        }
        if (this.add === undefined) {
            throw new TypeError("Concrete RepositoryInterface must implement -add");
        }
        if (this.remove === undefined) {
            throw new TypeError("Concrete RepositoryInterface must implement -remove");
        }
        if (this.findOne === undefined) {
            throw new TypeError("Concrete RepositoryInterface must implement -findOne");
        }
        if (this.find === undefined) {
            throw new TypeError("Concrete RepositoryInterface must implement -find");
        }

    }

}