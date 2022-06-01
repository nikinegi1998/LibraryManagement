const sinon = require('sinon');
const expect = require('chai').expect;
const mongoose = require('mongoose');

const User = require('../models/user');
const adminController = require('../controllers/admin')

describe('Admin controller testing', function () {

    describe('Get all users', function(){

        it('Should throw an error 500 if request failed', function(){
            sinon.stub(User, 'find');
            User.find.throws();
            
            adminController.getUsers().then(result => {
                expect(result).to.be.an('error');
                expect(result).to.have.property('statusCode', 500);
            });
            User.find.restore();
        })

        it('Should throw an error 422 if no users are available', function () {
            sinon.stub(User, 'find');
            User.find.throws();
            
            adminController.getUsers().then(result => {
                expect(result).to.be.an('error');
                expect(result).to.have.property('statusCode', 422);
            });
            User.find.restore();
        });
    })

    describe('Get user details by id', function () {
        it('Should throw an error 500 if request failed', function () {
            sinon.stub(User, 'findById');
            User.findById.throws();
            const req = {
                get: function(){
                    _id: 'arwfdfuyiii356786ttrese'
                }
            };
            adminController.getUser(req, {}, () => { }).then(result => {
                expect(result).to.be.an('error');
                expect(result).to.have.property('statusCode', 500);
            });
            User.findById.restore();
        });
        it('Should throw an error 422 if no records found', function () {
            sinon.stub(User, 'findById');
            User.findById.throws();
            const req = {
                get: function(){
                    _id: 'arwfdfuyiii356786ttrese'
                }
            };
            adminController.getUser(req, {}, () => { }).then(result => {
                expect(result).to.be.an('error');
                expect(result).to.have.property('statusCode', 422);
            });
            User.findById.restore();
        });
    });

    describe('Delete/disable User By id',function(){
        it('Should throw an error 500 if request failed',function(){
            sinon.stub(User,'findByIdAndRemove');
            User.findByIdAndRemove.throws();
            const req={
                get: function(){
                    _id:'arwfdfuyiii356786ttrese'
                }
            };
            adminController.removeUser(req,{},()=>{}).then(result=>{
                expect(result).to.be.an('error');
                expect(result).to.have.property('statusCode',500);
            });
            User.findByIdAndRemove.restore();
        });
        it('Should throw an error 422 if no records found',function(){
            sinon.stub(User,'findByIdAndRemove');
            User.findByIdAndRemove.throws();
            const req={
                body:{
                    _id:'abbddbhsdbsf'
                }
            };
            adminController.removeUser(req,{},()=>{}).then(result=>{
                expect(result).to.be.an('error');
                expect(result).to.have.property('statusCode',422);
            });
            User.findByIdAndRemove.restore();
        });
    });

})