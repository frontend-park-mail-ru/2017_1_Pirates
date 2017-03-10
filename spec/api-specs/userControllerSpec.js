"use strict";

describe('User controller', function () {

	const baseUrl = 'https://motion-project.herokuapp.com/user';
	const fetch = require('node-fetch');
	const myHeaders = {
		"Content-type":"application/json; charset=utf8"
	};


	describe('User creation',function () {

		it('should not response 500, even on request without body', function (done) {
			fetch(baseUrl + '/create', {
				method: 'POST',
				mode: 'CORS'
			}).then(response => {
				let status = response.status;
				expect(status).not.toBe(500);
				done(true)
			})
		});

		it('should response http status 200 and -1 code on correct request creation', function (done) {

			const body = JSON.stringify({
				login: "test",
				email: "test@test.ru",
				password: "password"
			});

			fetch(baseUrl + '/create', {
				method: 'POST',
				mode: 'CORS',
				headers: myHeaders,
				body: body
			})
				.then(response => {
					const status = response.status;
					expect(status).toBe(200);
					return response.json();
				})
				.then(body => {
					expect(body.status).toBe(-1);
					done(true);
				})
		});


		it('should response http status 200 and 605 code on trying create exists user', function (done) {
			const body = JSON.stringify({
				login: "test",
				email: "test@test.ru",
				password: "password"
			});

			fetch(baseUrl + '/create', {
				method: 'POST',
				mode: 'CORS',
				headers: myHeaders,
				body: body
			})
				.then(response => {
					const status = response.status;
					expect(status).toBe(200);
					return response.json();
				})
				.then(body => {
					expect(body.status).toBe(605);
					done(true);
				})
		});

		it('should response 200 http and 605 code on not correct login', function (done) {
			const body = JSON.stringify({
				login: "12",
				email: "test1@mail.ru",
				password: "password"
			});

			fetch(baseUrl + '/create', {
				method: 'POST',
				mode: 'CORS',
				headers: myHeaders,
				body: body
			})
				.then(response => {
					const status = response.status;
					expect(status).toBe(200);
					return response.json();
				})
				.then(body => {
					expect(body.status).toBe(605);
					done(true);
				})
		});

		it('should response 200 http and 605 code on not correct email', function (done) {
			const body = JSON.stringify({
				login: "test12",
				email: "test1mail.ru",
				password: "password"
			});

			fetch(baseUrl + '/create', {
				method: 'POST',
				mode: 'CORS',
				headers: myHeaders,
				body: body
			})
				.then(response => {
					const status = response.status;
					expect(status).toBe(200);
					return response.json();
				})
				.then(body => {
					expect(body.status).toBe(605);
					done(true);
				})
		});

		it('should response 200 http and 605 code on not correct password', function (done) {
			const body = JSON.stringify({
				login: "test123",
				email: "test12mail.ru",
				password: "as"
			});

			fetch(baseUrl + '/create', {
				method: 'POST',
				mode: 'CORS',
				headers: myHeaders,
				body: body
			})
				.then(response => {
					const status = response.status;
					expect(status).toBe(200);
					return response.json();
				})
				.then(body => {
					expect(body.status).toBe(605);
					done(true);
				})
		})


	});


	describe("User changing", function () {
		it('should not response 500, even on request without body', function (done) {
			fetch(baseUrl + '/changeEmail', {
				method: 'POST',
				mode: 'CORS'
			})
				.then(response => {
				let status = response.status;
				expect(status).not.toBe(500);
				return fetch(baseUrl + '/changeLogin');
			})
				.then(response => {
					let status = response.status;
					expect(status).not.toBe(500);
					return fetch(baseUrl + '/changePassword');
				})
				.then(response => {
					let status = response.status;
					expect(status).not.toBe(500);
					done(true);
				})
		});

	})

});
