const { Request } = require('jest-express/lib/request');
const { Response } = require('jest-express/lib/response');

const authMiddleware = require('../../middlewares/auth');
const jwt = require('jsonwebtoken');


jest.mock('jsonwebtoken', () => ({
    sign: jest.fn(),
    verify: jest.fn(),
}));

describe('auth', () => {
    beforeEach(() => {
        req = new Request();
        res = new Response();
        jest.resetModules();
    });

    it('success', async () => {
        const next = jest.fn();
        req.setHeaders('authorization', 'bearer jwtToken');
        jwt.verify = jest.fn().mockReturnValueOnce('mockedJwt');
        await authMiddleware(req, res, next);
        expect(next.mock.calls.length).toBe(1);
    });

    it('no token', async () => {
        const next = jest.fn();
        jwt.verify = jest.fn().mockReturnValueOnce('mockedJwt');
        await authMiddleware(req, res, next);
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.body.errors[0]).toEqual('A token is required for authentication');
    });

    // it('something wrong while decode token', async () => {
    //     req.setHeaders('authorization', 'bearer jwtToken');
    //     const next = jest.fn();
    //     jwt.verify = jest.fn().mockRejectedValueOnce( Promise.reject(new Error('error')));
    //     await authMiddleware(req, res, next);
    //     expect(next.mock.calls.length).toBe(1);
    //     // expect(res.status).toHaveBeenCalledWith(401);
    //     // expect(res.body.errors[0]).toEqual('please re-login');
    // });
});
