const expect = require('chai').expect;
const jwt = require('jsonwebtoken');
const sinon = require('sinon');

const authMiddleware = require('../middleware/is-auth');

describe('Is-Auth Middleware Testing', function(){
    it('should throw an error if no authorization header is present',
    function () {
        const req = {
            get: function (headerName) {
                return null;
            }
        }

        expect(authMiddleware.bind(this, req, {}, () => { })).to.throw('Not authenticated.')
    })

    it('should throw an error if authorization header is only 1 string',
    function () {
        const req = {
            get: function (headerName) {
                return 'xyz';
            }
        }

        expect(authMiddleware.bind(this, req, {}, () => { })).to.throw()
    })

    it('should yield userId after decoding the token',
    function () {
        const req = {
            get: function (headerName) {
                return 'bearer heeoqmmmsmekekq';
            }
        };

        sinon.stub(jwt, 'verify')
        jwt.verify.returns({userId: 'abc', role: 'USER'})

        authMiddleware(req, {}, ()=>{})
        expect(req).to.have.property('userId')
        expect(req).to.have.property('role')
        expect(jwt.verify.called).to.be.true

        jwt.verify.restore()
    })
})
