const { Request } = require('jest-express/lib/request');
const { Response } = require('jest-express/lib/response');

const userController = require('../../controllers/user');
const User = require('../../models/user');
const redisClient = require('../../services/cache');

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
}));

describe('User index', () => {
    beforeEach(() => {
        req = new Request();
        res = new Response();
        jest.resetModules();
    });

    it('return from redis', async () => {
        redisClient.get.mockImplementation((key, callback) => {
            callback(null, JSON.stringify([
                {
                    _id: "_id",
                    userName: "userName",
                    accountNumber: "accountNumber",
                    emailAddress: "emailAddress",
                    identityNumber: "identityNumber"
                }
            ]))
        });
        await userController.index(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(Array.isArray(res.body)).toBeTruthy();
    });

    it('return from mongo', async () => {
        redisClient.get.mockImplementation((key, callback) => {
            callback(null, null)
        });
        User.find.mockImplementation(() => Promise.resolve(
            [
                {
                    _id: "_id",
                    userName: "userName",
                    accountNumber: "accountNumber",
                    emailAddress: "emailAddress",
                    identityNumber: "identityNumber"
                }
            ]
        ));
        await userController.index(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(Array.isArray(res.body)).toBeTruthy();
        expect(redisClient.set.mock.calls.length).toBe(1);
    });

    // it('something error from db', async () => {
    //     redisClient.get.mockImplementation((key, callback) => {
    //         callback(null, null)
    //     });
    //     User.find.mockImplementation(() => Promise.reject(new Error('internal error')));

    //     await userController.index(req, res);
    //     expect(res.status).toHaveBeenCalledWith(500);
    //     expect(res.body.errors[0]).toEqual('internal error');
    // });
});

describe('User show', () => {
    beforeEach(() => {
        req = new Request();
        res = new Response();
        jest.resetModules();
    });

    it('user found', async () => {
        User.findById.mockImplementation(() => Promise.resolve(
            {
                _id: "_id",
                userName: "userName",
                accountNumber: "accountNumber",
                emailAddress: "emailAddress",
                identityNumber: "identityNumber"
            }
        ));
        await userController.show(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.body.userName).toBeDefined();
    });

    it('user not found', async () => {
        User.findById.mockImplementation(() => Promise.resolve(null));
        await userController.show(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.body.errors[0]).toEqual('Not Found');
    });

    it('something error from db', async () => {
        User.findById.mockImplementation(() => Promise.reject(new Error('internal error')));

        await userController.show(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.body.errors[0]).toEqual('internal error');
    });
});

describe('User getUserByAccountNumber', () => {
    beforeEach(() => {
        req = new Request();
        res = new Response();
        jest.resetModules();
    });

    it('user found', async () => {
        User.findOne.mockImplementation(() => Promise.resolve(
            {
                _id: "_id",
                userName: "userName",
                accountNumber: "accountNumber",
                emailAddress: "emailAddress",
                identityNumber: "identityNumber"
            }
        ));
        await userController.getUserByAccountNumber(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.body.userName).toBeDefined();
    });

    it('user not found', async () => {
        User.findOne.mockImplementation(() => Promise.resolve(null));
        await userController.getUserByAccountNumber(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.body.errors[0]).toEqual('Not Found');
    });

    it('something error from db', async () => {
        User.findOne.mockImplementation(() => Promise.reject(new Error('internal error')));

        await userController.getUserByAccountNumber(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.body.errors[0]).toEqual('internal error');
    });
});

describe('User getUserByIdentityNumber', () => {
    beforeEach(() => {
        req = new Request();
        res = new Response();
        jest.resetModules();
    });

    it('user found', async () => {
        User.findOne.mockImplementation(() => Promise.resolve(
            {
                _id: "_id",
                userName: "userName",
                accountNumber: "accountNumber",
                emailAddress: "emailAddress",
                identityNumber: "identityNumber"
            }
        ));
        await userController.getUserByIdentityNumber(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.body.userName).toBeDefined();
    });

    it('user not found', async () => {
        User.findOne.mockImplementation(() => Promise.resolve(null));
        await userController.getUserByIdentityNumber(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.body.errors[0]).toEqual('Not Found');
    });

    it('something error from db', async () => {
        User.findOne.mockImplementation(() => Promise.reject(new Error('internal error')));

        await userController.getUserByIdentityNumber(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.body.errors[0]).toEqual('internal error');
    });
});

describe('User create', () => {
    beforeEach(() => {
        req = new Request();
        res = new Response();
        jest.resetModules();
    });

    it('all required field filled', async () => {
        req.setBody({
            _id: "_id",
            userName: "userName",
            accountNumber: "accountNumber",
            emailAddress: "emailAddress",
            identityNumber: "identityNumber"
        });
        User.create.mockImplementation((data) => Promise.resolve(data));
        await userController.create(req, res);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.body.userName).toBeDefined();
    });

    it('any required field not filled', async () => {
        req.setBody({
            _id: "_id",
            userName: "userName",
            emailAddress: "emailAddress",
            identityNumber: "identityNumber"
        });
        User.create.mockImplementation((data) => Promise.reject(new Error('field error')));
        await userController.create(req, res);
        expect(res.status).toHaveBeenCalledWith(422);
        expect(res.body.errors[0]).toEqual('field error');
    });
});

describe('User update', () => {
    beforeEach(() => {
        req = new Request();
        res = new Response();
        jest.resetModules();
    });

    it('success', async () => {
        req.setBody({
            _id: "_id",
            userName: "userName",
            accountNumber: "accountNumber",
            emailAddress: "emailAddress",
            identityNumber: "identityNumber"
        });
        User.findByIdAndUpdate.mockImplementation((_, data) => Promise.resolve(data));
        User.findById.mockImplementation(() => Promise.resolve(
            {
                _id: "_id",
                userName: "userName",
                accountNumber: "accountNumber",
                emailAddress: "emailAddress",
                identityNumber: "identityNumber"
            }
        ));
        await userController.update(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.body.userName).toBeDefined();
    });

    it('any required field not filled', async () => {
        req.setBody({
            _id: "_id",
            userName: "userName",
            emailAddress: "emailAddress",
            identityNumber: "identityNumber"
        });
        User.findByIdAndUpdate.mockImplementation((data) => Promise.reject(new Error('field error')));
        await userController.update(req, res);
        expect(res.status).toHaveBeenCalledWith(422);
        expect(res.body.errors[0]).toEqual('field error');
    });

    it('data not found', async () => {
        req.setBody({
            _id: "_id",
            userName: "userName",
            emailAddress: "emailAddress",
            identityNumber: "identityNumber"
        });
        User.findByIdAndUpdate.mockImplementation((_, data) => Promise.resolve(null));
        await userController.update(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.body.errors[0]).toEqual('Not Found');
    });

    it('duplicate field', async () => {
        req.setBody({
            _id: "_id",
            userName: "userName",
            emailAddress: "emailAddress",
            identityNumber: "identityNumber"
        });
        User.findByIdAndUpdate.mockImplementation((data) => Promise.reject({
            code: 11000,
            message: "duplicate",
            keyValue: {
                field: "field"
            },
        }));
        await userController.update(req, res);
        expect(res.status).toHaveBeenCalledWith(422);
        expect(res.body.errors[0].includes("already taken")).toBeTruthy();
    });
});

describe('User unlink', () => {
    beforeEach(() => {
        req = new Request();
        res = new Response();
        jest.resetModules();
    });

    it('success', async () => {
        req.setParams({
            userId: "_idTodelete",
        });
        req.user = {
            id: "_id",
        }
        User.findByIdAndRemove.mockImplementation((id) => Promise.resolve({}))
        
        await userController.unlink(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
    });

    it('prevent delete own data', async () => {
        req.setParams({
            userId: "_idTodelete",
        });
        req.user = {
            id: "_idTodelete",
        }
        User.findByIdAndRemove.mockImplementation((id) => Promise.resolve({}))
        
        await userController.unlink(req, res);
        expect(res.status).toHaveBeenCalledWith(422);
        expect(res.body.errors[0]).toEqual('Cannot delete your own data');
    });

    it('db error', async () => {
        req.setParams({
            userId: "_idTodelete",
        });
        req.user = {
            id: "_id",
        }
        User.findByIdAndRemove.mockImplementation((id) => Promise.reject(new Error('something error')));
        
        await userController.unlink(req, res);
        expect(res.status).toHaveBeenCalledWith(422);
        expect(res.body.errors[0]).toEqual('something error');
    });
});
