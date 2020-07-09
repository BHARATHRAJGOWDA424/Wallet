const AWSStorage = require('./awsStorage');


module.exports = class FileStorageFactory {

    create(AWSConstants){
    
        return new AWSStorage(AWSConstants)
        
    }

}