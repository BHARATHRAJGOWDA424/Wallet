const UseCaseInterface = require('./UseCaseInterface');
const AuthControlFactory = require('../core/authControl/AuthControlFactory');
const HttpError = require('standard-http-error');
const UserRepository = require('../repositories/UserRepository')
var uniqid = require('uniqid');

module.exports = class BaseUseCase extends UseCaseInterface {
    constructor(request, response) {
        super();
        this.request = request;
        this.response = response;
    }

    validate() { }

    async execute() { }


    async authorize(requiredRoleTypes, user) {
        try {
            if (requiredRoleTypes.indexOf(user.role) == -1) {
                throw new HttpError(401, "UnAuthorized");
            }
        } catch (error) {
            throw error;
        }
    }

    validateForPageRequest() {
        try {
            var pageIndex = this.request.query.pageIndex;

            if (pageIndex == undefined) {
                throw new HttpError(400, "pageIndex can not be empty");
            } else {
                pageIndex = parseInt(this.request.query.pageIndex);
                if (isNaN(pageIndex)) {
                    throw new HttpError(400, "pageIndex can not be empty");
                } else {
                    this.request.query.pageIndex = pageIndex;
                }
            }

            let pageSize = this.request.query.pageSize;
            if (pageSize == undefined) {
                throw new HttpError(400, "pageSize can not be empty");
            } else {
                pageSize = parseInt(this.request.query.pageSize);
                if (isNaN(pageSize)) {
                    throw new HttpError(400, "pageSize can not be empty");
                } else {
                    this.request.query.pageSize = pageSize;
                }
            }
        } catch (error) {
            this.request.query.pageIndex = 0;
            this.request.query.pageSize = 20;
        }
    }

    async authenticate() {
        try {
            let headers = this.request.headers;
            let authControl = new AuthControlFactory().create();

            let payload = authControl.decode(headers.token, process.env.kJWTSecret);
            this.tokenPayload = payload
            let id = payload.id;
            let role = payload.role
            let email = payload.email
            let tenantId = payload.tenantId
            if (id == undefined) {
                throw new HttpError(401, "UnAuthorized");
            }
            let repo

            // if (role === Role.ProductManager || role === Role.Tenant || Role.ProductOwner) {
            //     repo = new UserRepository()
            // } else if (role === Role.Admin) {
            //     repo = new AdminRepository()
            // }else if(role===Role.SuperAdmin){
            //     repo= new SuperAdminRepository();
            // }
            let user = await repo.findOne({ loginToken: headers.token }, tenantId);
            if (!user) {
                throw new HttpError(417, "Your Session Expired, Try To Login Again");
            }

            if (user.role === Role.Admin && user.administration.status !== TenantStatus.Active) {
                throw new HttpError(401, "UnAuthorized");
            }

            if (user.role === Role.Tenant && user.productManagement.status !== TenantStatus.Active) {
                throw new HttpError(401, "UnAuthorized");
            }

            if (user.role === Role.ProductManager && user.productManagement.status !== ProductManagerStatus.Active) {
                throw new HttpError(401, "UnAuthorized");
            }
            return user;
        } catch (error) {
            throw error;
        }
    }

    async executeAndHandleErrors() {
        try {
            let data = await this.execute();
            if (data == null) {
                data = {};
            }
            if (data.error) {
                let error = data
                throw error;
            }
            let code = 200;
            data.code = code;
            this.response.status(code).json(data);
        } catch (error) {
            if (error != null) {
                let message = error.message;

                if (error.code == 11000) {
                    message = error.message;
                }

                let code = error.code ? error.code : 400;
                let data = { code: code, message: message };
                this.response.status(code >= 100 && code < 600 ? code : 500).json(data);
            } else {
                let data = {
                    code: 400,
                    message: "Unable to process your request, please try again"
                };
                this.response.status(400).json(data);
            }
        }
    }
};
