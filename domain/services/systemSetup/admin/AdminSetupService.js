const UserRepository = require('../../../../repositories/UserRepository');
const adminConfig = require('./admin');
const HashControlFactory = require('../../../../core/hashControl/HashControlFactory');

module.exports = class AdminSetupService {


    constructor(hashControl) {
        this.hashControl = hashControl
    }


    static create() {

        let hashControlFactory = new HashControlFactory()
        let hashControl = hashControlFactory.create()
        return new AdminSetupService(hashControl)

    }

    async setup() {

        try {

            let adminRepo = new UserRepository()
            let count = await adminRepo.count({})
            console.log(count,'count');
            
            if (count == 0) {
                let config = adminConfig['dev']
                for (let admin of config) {
                    admin.password = await this.hashControl.hash(admin.password)
                    // let administration = {}
                    // administration.status = AdminStatus.Active
                    // admin.administration = administration
                    await adminRepo.add(admin)
                }
            }

        } catch (error) {
            console.log(error,'err');
            
            throw error
        }

    }


}