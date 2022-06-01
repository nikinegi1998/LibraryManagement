const sinon = require('sinon');
const expect = require('chai').expect;
const mongoose = require('mongoose');

const User = require('../models/user');
const Book = require('../models/book');
const UserController = require('../controllers/user');

describe('User Controller ', function () {

    describe('Login Function Testing',
        function () {
            it('Should throws an error with code 500 if accessing the database fails',
                function (done) {
                    sinon.stub(User, 'findOne');
                    User.findOne.throws();

                    const req = {
                        body: {
                            email: 'user1@mail.com',
                            password: '12345'
                        }
                    };
                    UserController.loginUser(req, {}, () => { }).then(result => {
                        expect(result).to.be.an('error');
                        expect(result).to.have.property('statusCode', 500);
                        done();
                    });
                    User.findOne.restore();
                });

            it('Should through an error with code 422 if find the value in database fails', function () {
                sinon.stub(User, 'findOne');
                User.findOne.throws();
                const req = {
                    body: {
                        email: 'user1@mail.com',
                        password: '12345',
                    }
                };
                UserController.loginUser(req, {}, () => { }).then(result => {
                    expect(result).to.be.an('error');
                    expect(result).to.have.property('statusCode', 422);
                });
                User.findOne.restore();
            })
        })

    describe('Book add to user\'s wishlist',
        function () {
            it('should throw an error 500 if request failed',
                function () {
                    sinon.stub(Book, 'findById');
                    Book.findById.throws();

                    const req = {
                        _id: '628e81089e5831e395803e16',
                    }

                    UserController.addToFav(req, {}, () => { })
                        .then(result => {
                            expect(result).to.be.an('error');
                            expect(result).to.have.property('statusCode', 500)
                        })
                    Book.findById.restore();
                })
        })

    describe('Book remove from user\'s wishlist',
        function () {
            it('should throw an error 500 if request failed',
                function () {
                    sinon.stub(Book, 'findById');
                    Book.findById.throws();
                    const req = {
                        body: {
                            _id: '628e81089e5831e395803e16',
                            userId: 'sdsd8ecsk89cs78snnc903e16'
                        }
                    };
                    UserController.removeFromFav(req, {}, () => { }).then(result => {
                        expect(result).to.be.an('error');
                        expect(result).to.have.property('statusCode', 500);
                    });
                    Book.findById.restore();
                })
            it('Should throw an error 422 if book not found', function () {
                sinon.stub(Book, 'findById');
                Book.findById.throws();
                const req = {
                    body: {
                        _id: '628e81089e5831e395803ehjb6',
                        userId: 'sdsd8ecsk89cs78snnc903e16'
                    }
                };
                UserController.removeFromFav(req, {}, () => { }).then(result => {
                    expect(result).to.be.an('error');
                    expect(result).to.have.property('statusCode', 422);
                });
                Book.findById.restore();
            });
        })

})