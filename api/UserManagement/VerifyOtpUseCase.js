const BaseUseCase = require('../BaseUseCase');
const UserRepository = require('../../repositories/UserRepository')
const HashControlFactory = require('../../core/hashControl/HashControlFactory');
const AuthControlFactory = require('../../core/authControl/AuthControlFactory');
const HttpError = require('standard-http-error')
const ObjectPath = require("object-path");
const SmsService = require('../../core/sms/Sms');
const RegistrationStatus = require('../../domain/enumerations/RegistrationStatus')

module.exports = class AuthenticateVerifyOtpUseCase extends BaseUseCase {

    constructor(request, response, hashControl, authControl, userRepository, smsService) {
        super(request, response);
        this.hashControl = hashControl
        this.authControl = authControl
        this.userRepository = userRepository
        this.smsService = smsService
    }

    validate() {

        try {

            let body = this.request.body
            let email = ObjectPath.get(body, "phoneNumber")
            if (email == undefined) {
                throw new HttpError(400, "phoneNumber can not be empty");
            }

            let otp = ObjectPath.get(body, "otp")
            if (otp == undefined) {
                throw new HttpError(400, "otp can not be empty");
            }

        } catch (error) {
            throw error;

        }
    }


    async execute() {

        try {

            this.validate()
            let body = this.request.body

            let user = await this.userRepository.findOne({ phoneNumber: body.phoneNumber })

            if (user == null) {
                throw new HttpError(400, "user not found");
            }

            const now = new Date()
            if (user.otp.otp != null && user.otp.expiredAt != null) {
                let valid = await this.hashControl.compare(body.otp, user.otp.otp)
                if (now > user.otp.expiredAt || valid == false) {
                    throw new HttpError(400, "Invalid OTP");
                }
            } else {
                await this.smsService.verifyOTP(body.ph, body.otp)
            }

            if (user.status === RegistrationStatus.Registered) {
                user.status = RegistrationStatus.Active
                user = await user.save()
            }

            return {
                message: 'Otp Verify Successfully',
            }

        } catch (error) {
            throw error
        }

    }

    static create(request, response) {

        let hashControlFactory = new HashControlFactory()
        let hashControl = hashControlFactory.create()
        let authControlFactory = new AuthControlFactory()
        let authControl = authControlFactory.create()

        let useCase = new AuthenticateVerifyOtpUseCase(request, response, hashControl, authControl, new UserRepository(), SmsService.create())
        return useCase;

    }
}