const express = require('express');
const router = express.Router();
const AuthenticateUseCase=require('./AuthenticateUseCase')
const SignupUserUseCase=require('./SignupUserUseCase')

router.post('/user/authenticate', async (request, response, next) => {
    let useCase = AuthenticateUseCase.create(request, response)
    await useCase.executeAndHandleErrors()
});

router.post('/user/signup', async (request, response, next) => {
    let useCase = SignupUserUseCase.create(request, response)
    await useCase.executeAndHandleErrors()
});

module.exports = router;
