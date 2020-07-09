module.exports = class FileStorageInterface {
    
        constructor() {

            if (this.upload == undefined) {
                throw new TypeError("Concrete FileStorageInterface must implement -upload");
            }
            if (this.delete == undefined) {
                throw new TypeError("Concrete FileStorageInterface must implement -delete");
            }
            if (this.download == undefined) {
                throw new TypeError("Concrete FileStorageInterface must implement -download");
            }
        }
    
    }