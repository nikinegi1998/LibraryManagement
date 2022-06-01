const sinon = require('sinon');
const expect = require('chai').expect;
const mongoose = require('mongoose');

const Book = require('../models/book');
const bookController = require('../controllers/book')

describe('Book controller Testing', function () {

    describe('Get all books', function () {
        it('Should throw an error 500 if request failed', function () {
            sinon.stub(Book, 'find');
            Book.find.throws();
            const req = {
                body: {
                    _id: 'arwfdfuyiii356786ttrese'
                }
            };
            bookController.getBooks(req, {}, () => { }).then(result => {
                expect(result).to.be.an('error');
                expect(result).to.have.property('statusCode', 500);
            });
            Book.find.restore();
        });
        it('Should throw an error 422 if no books are available', function () {
            sinon.stub(Book, 'find');
            Book.find.throws();
            const req = {
                body: {
                    _id: 'arwfdfuyiii356786ttrese'
                }
            };
            bookController.getBooks(req, {}, () => { }).then(result => {
                expect(result).to.be.an('error');
                expect(result).to.have.property('statusCode', 422);
            });
            Book.find.restore();
        });
    })

    describe('Get book by id', function () {
        it('Should throw an error 500 if request failed', function () {
            sinon.stub(Book, 'findById');
            Book.findById.throws();
            const req = {
                body: {
                    _id: 'arwfdfuyiii356786ttrese'
                }
            };
            bookController.getBook(req, {}, () => { }).then(result => {
                expect(result).to.be.an('error');
                expect(result).to.have.property('statusCode', 500);
            });
            Book.findById.restore();
        });
        it('Should throw an error 422 if no records found', function () {
            sinon.stub(Book, 'findById');
            Book.findById.throws();
            const req = {
                body: {
                    _id: 'arwfdfuyiii356786ttrese'
                }
            };
            bookController.getBook(req, {}, () => { }).then(result => {
                expect(result).to.be.an('error');
                expect(result).to.have.property('statusCode', 422);
            });
            Book.findById.restore();
        });
    });

    describe('Update book details', function () {
        it('Should throw an error 500 if request failed', function () {
            sinon.stub(Book, 'findById');
            Book.findById.throws();
            const req = {
                get: function(headerName){
                    return 'arwfdfuyiii356786ttrese'
                },
                body: {
                    title : 'title',
                    isbn : 'isbn',
                    author : 'author',
                    genre : 'genre',
                    yop : 'yop',
                    publisher : 'publisher',
                    userId : 'sdsd8ecsk89cs78snnc903e16'
                }
            };
            bookController.postUpdateBook(req, {}, () => { }).then(result => {
                expect(result).to.be.an('error');
                expect(result).to.have.property('statusCode', 500);
            });
            Book.findById.restore();
        });
        it('Should throw an error 422 if no records found', function () {
            sinon.stub(Book, 'findById');
            Book.findById.throws();
            const req = {
                get: function(){
                    _id: 'arwfdfuyiii356786ttrese'
                }
            };
            bookController.postUpdateBook(req, {}, () => { }).then(result => {
                expect(result).to.be.an('error');
                expect(result).to.have.property('statusCode', 422);
            });
            Book.findById.restore();
        });
    });

    describe('Delete Book By id',function(){
        it('Should throw an error 500 if request failed',function(){
            sinon.stub(Book,'findByIdAndRemove');
            Book.findByIdAndRemove.throws();
            const req={
                get: function(){
                    _id:'arwfdfuyiii356786ttrese'
                }
            };
            bookController.removeBook(req,{},()=>{}).then(result=>{
                expect(result).to.be.an('error');
                expect(result).to.have.property('statusCode',500);
            });
            Book.findByIdAndRemove.restore();
        });
        it('Should throw an error 422 if no records found',function(){
            sinon.stub(Book,'findByIdAndRemove');
            Book.findByIdAndRemove.throws();
            const req={
                body:{
                    _id:'abbddbhsdbsf'
                }
            };
            bookController.removeBook(req,{},()=>{}).then(result=>{
                expect(result).to.be.an('error');
                expect(result).to.have.property('statusCode',422);
            });
            Book.findByIdAndRemove.restore();
        });
    });

    describe('Searching Book', function () {
        it('Should return an error 500 if book not found', function () {
            sinon.stub(Book, 'find');
            Book.find.throws();
            const req = {
                body: {
                    title: 'title',
                    authors: 'new book',
                    genre: 'Sci-Fi',
                    yop: 'some date',
                    publisher: 'Some author'
                }
            };
            bookController.searchWithKeyword(req, {}, () => { }).then(result => {
                expect(result).to.be.an('error');
                expect(result).to.have.property('statusCode', 500);
            });
            Book.find.restore();
        });
    });

})