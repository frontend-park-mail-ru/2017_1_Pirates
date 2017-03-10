'use strict';
describe('Session controller', function () {

	const baseUrl = 'https://motion-project.herokuapp.com/session';
	const baseCreationUrl = 'https://motion-project.herokuapp.com/user';
	const fetch = require('node-fetch');
	const myHeaders = {
		"Content-type":"application/json; charset=utf8",
		"X-Test-Environment-Key":"qcOluDht4uNCJwlIJdTEcxzytdLp4qTp3LLYwxJM"
	};

	describe('Login user', function () {

		beforeEach(function (done) {
			fetch('https://motion-project.herokuapp.com/test/start', {
				method: 'POST',
				mode: 'CORS',
				headers: myHeaders
			})
				.then(response=>{
					expect(response.status).toBe(200);
					return fetch(baseCreationUrl + '/create', {
						method: 'POST',
						mode: 'CORS',
						headers: myHeaders,
						body: JSON.stringify({login: "test", email: "test@test.ru", password: "password"})
					})
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

		it('should not response 500, even on request without body', function (done) {
			fetch(baseUrl + '/login', {
				method: 'POST',
				mode: 'CORS',
				headers: myHeaders
			}).then(response => {
				let status = response.status;
				expect(status).not.toBe(500);
				done(true)
			})
		});

		it('should response http 200 and -1 status code on correct data', function (done) {
			fetch(baseUrl + '/login', {
				method: 'POST',
				mode: 'CORS',
				headers: myHeaders,
				body: JSON.stringify({login_or_email:"test@test.ru", password:"password"})
			})
				.then(response => {
					expect(response.status).toBe(200);
					return response.json();
				})
				.then(body => {
					expect(body.status).toBe(-1);
					done(true);
				})

		})
	})
})
