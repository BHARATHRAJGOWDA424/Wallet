const BaseUseCase = require('../BaseUseCase');
const ValidationUtils = require('../../core/validationUtils/validationUtils')
const HashControlFactory = require('../../core/hashControl/HashControlFactory');
const HttpError = require('standard-http-error')
const NotificationService = require('../../domain/services/notification/NotificationService');
const ObjectPath = require("object-path");
const SmsService = require('../../core/sms/Sms')
const UserRepository = require('../../repositories/UserRepository')
module.exports = class SignupUserUseCase extends BaseUseCase {
    constructor(request, response,hashControl, validationUtils, notificationService, userRepository) {
        super(request, response);
        this.hashControl = hashControl
        this.validationUtils = validationUtils;
        this.notificationService = notificationService;
        this.userRepository = userRepository;
        this.smsService = SmsService.create()

    }

    validate(name, email, phoneNumber, password) {
        if (email == undefined) {
            throw new HttpError(400, "Email can not be empty");
        }
        if (this.validationUtils.isEmailValid(email) === false) {
            throw new HttpError(400, "Enter valid email");
        }
        if (name.trim().length == 0) {
            throw new HttpError(400, "Enter valid name");
        }
        if (this.validationUtils.isValidText(name) === false) {
            throw new HttpError(400, "Enter valid name");
        }

        if (password == undefined) {
            throw new HttpError(400, "Password can not be empty");
        }

        if (this.validationUtils.isPasswordValid(password) === false) {
            throw new HttpError(400, "Enter valid Password");
        }
        if (this.validationUtils.isValidText(name) === false) {
            throw new HttpError(400, "Enter valid name");
        }
        if (!phoneNumber) {
            throw new HttpError(400, 'Empty phone number')
        } else if (this.validationUtils.isValidNumber(phoneNumber, 10) === false) {
            throw new HttpError(400, `Invalid phone number , `)
        }
    }


    async execute() {
        try {

            let body = this.request.body
            let user = body.user;
            let name = ObjectPath.get(user, "name").trim()
            let email = ObjectPath.get(user, "email").trim()
            let phoneNumber = ObjectPath.get(user, "phoneNumber").trim()
            let password = ObjectPath.get(user, "password")
            this.validate(name, email, phoneNumber, password)
            let addedTenant = await this.userRepository.add(user)            
            let hashedPassword = await this.hashControl.hash(password)
            addedTenant.password = hashedPassword
            addedTenant.save()
            let otp = Math.floor(100000 + Math.random() * 900000);
            await this.smsService.sendOTP(phoneNumber, otp)
            return {
                message: 'User Added Successfully',
                addedTenant
            }

        } catch (error) {
            if (error.code === 11000) {
                throw new HttpError(400, `User with email or phoneNumber is already registered`)
            }
            throw error;
        }
    }

    static create(request, response) {
        let hashControlFactory = new HashControlFactory()
        let hashControl = hashControlFactory.create()
        let useCase = new SignupUserUseCase(
            request,
            response,
            hashControl,
            new ValidationUtils(),
            new NotificationService(),
            new UserRepository(),
        );
        return useCase;
    }
};
