const { Request } = require('jest-express/lib/request');
const { Response } = require('jest-express/lib/response');

const authController = require('../../controllers/auth');
const User = require('../../models/user');
// const redisClient = require('../../services/cache');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

jest.mock('../../services/cache', () => ({
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
}));

jest.mock('../../models/user', () => ({
    find: jest.fn(),
    findById: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndRemove: jest.fn(),
    findOne: jest.fn(),
}));

jest.mock('jsonwebtoken', () => ({
    sign: jest.fn(),
}));

jest.mock('bcrypt', () => ({
    compare: jest.fn(),
}));

describe('signUp', () => {
    beforeEach(() => {
        req = new Request();
        res = new Response();
        jest.resetModules();
    });

    it('all required field filled', async () => {
        req.setBody({
            userName: "userName",
            accountNumber: "accountNumber",
            emailAddress: "emailAddress",
            identityNumber: "identityNumber"
        });
        User.create.mockImplementation((data) => Promise.resolve(data));
        jwt.sign = jest.fn().mockReturnValueOnce('mockedJwt');
        await authController.signUp(req, res);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.body.token).toBeDefined();
    });

    it('any required field not filled', async () => {
        req.setBody({
            userName: "userName",
            emailAddress: "emailAddress",
            identityNumber: "identityNumber"
        });
        User.create.mockImplementation((data) => Promise.reject(new Error('error')));
        jwt.sign = jest.fn().mockReturnValueOnce('mockedJwt');
        await authController.signUp(req, res);
        expect(res.status).toHaveBeenCalledWith(422);
        expect(res.body.errors[0]).toEqual('error');
    });
});

describe('signIn', () => {
    beforeEach(() => {
        req = new Request();
        res = new Response();
        jest.resetModules();
    });

    it('success', async () => {
        req.setBody({
            userName: "userName",
            password: "password",
        });
        User.findOne.mockImplementation((data) => Promise.resolve({
            userName: "userName",
            password: "password",
        }));
        jwt.sign = jest.fn().mockReturnValueOnce('mockedJwt');
        bcrypt.compare = jest.fn().mockResolvedValueOnce(true);
        await authController.signIn(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.body.token).toBeDefined();
    });

    it('password false ', async () => {
        req.setBody({
            userName: "userName",
            password: "passwordFalse",
        });
        User.findOne.mockImplementation((data) => Promise.resolve({
            userName: "userName",
            password: "password",
        }));
        jwt.sign = jest.fn().mockReturnValueOnce('mockedJwt');
        bcrypt.compare = jest.fn().mockResolvedValueOnce(false);
        await authController.signIn(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.body.errors[0]).toEqual('Invalid Credentials');
    });

    it('any input blank ', async () => {
        req.setBody({
            userName: "",
            password: "passwordFalse",
        });
        User.findOne.mockImplementation((data) => Promise.resolve({
            userName: "userName",
            password: "password",
        }));
        jwt.sign = jest.fn().mockReturnValueOnce('mockedJwt');
        bcrypt.compare = jest.fn().mockResolvedValueOnce(false);
        await authController.signIn(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.body.errors[0]).toEqual('All input is required');
    });

    // it('something error', async () => {
    //     req.setBody({
    //         userName: "",
    //         password: "passwordFalse",
    //     });
    //     // User.findOne.mockImplementation((data) => {
    //     //     throw new Error('error');
    //     // });
    //     // jwt.sign.mockImplementation((data) => {
    //     //     throw new Error('error');
    //     // });
    //     // bcrypt.compare = jest.fn().mockRejectedValueOnce(new Error('error'));
    //     await authController.signIn(req, res);
    //     expect(res.status).toHaveBeenCalledWith(500);
    //     expect(res.body.errors[0]).toEqual('error');
    // });
});
