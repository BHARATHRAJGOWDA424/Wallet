const express = require('express');
const router = express.Router();
const AuthenticateUseCase=require('./AuthenticateUseCase')

router.post('/user/authenticate', async (request, response, next) => {
    let useCase = AuthenticateUseCase.create(request, response)
    await useCase.executeAndHandleErrors()
});

module.exports = router;
