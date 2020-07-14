const express = require('express');
const router = express.Router();
const AuthenticateUseCase=require('./AuthenticateUseCase')
const SignupUserUseCase=require('./SignupUserUseCase')
const VerifyOtpUseCase=require('./VerifyOtpUseCase')

router.post('/user/authenticate', async (request, response, next) => {
    let useCase = AuthenticateUseCase.create(request, response)
    await useCase.executeAndHandleErrors()
});

router.post('/user/signup', async (request, response, next) => {
    let useCase = SignupUserUseCase.create(request, response)
    await useCase.executeAndHandleErrors()
});

router.post('/user/verify-otp', async (request, response, next) => {
    let useCase = VerifyOtpUseCase.create(request, response)
    await useCase.executeAndHandleErrors()
});

module.exports = router;
