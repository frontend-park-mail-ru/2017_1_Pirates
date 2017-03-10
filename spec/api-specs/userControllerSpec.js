"use strict";

describe('User controller', function () {

	const baseUrl = 'https://motion-project.herokuapp.com/user';
	const fetch = require('node-fetch');
	const myHeaders = {
		"Content-type":"application/json; charset=utf8",
		"X-Test-Environment-Key":"qcOluDht4uNCJwlIJdTEcxzytdLp4qTp3LLYwxJM"
	};


	describe('User creation',function () {

		beforeEach(function (done) {
			fetch('https://motion-project.herokuapp.com/test/start', {
				method: 'POST',
				mode: 'CORS',
				headers: myHeaders
			})
				.then(response=>{
					expect(response.status).toBe(200);
					done(true);
				})

		});

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
			fetch(baseUrl + '/create', {
				method: 'POST',
				mode: 'CORS',
				headers: myHeaders,
				body: JSON.stringify({login: "test", email: "test@test.ru", password: "password"})
			})
				.then(response => {
					const status = response.status;
					expect(status).toBe(200);
					return response.json();
				})
				.then(body => {
					expect(body.status).toBe(-1);
					return fetch(baseUrl + '/create', {
								method: 'POST',
								mode: 'CORS',
								headers: myHeaders,
								body: JSON.stringify({login: "test", email: "test@test.ru", password: "password"})
							})
				})
				.then(response => {
					expect(response.status).toBe(200);
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


		const myHeaders = {
			"Content-type":"application/json; charset=utf8",
			"X-Test-Environment-Key":"qcOluDht4uNCJwlIJdTEcxzytdLp4qTp3LLYwxJM"
		};


		beforeEach(function (done) {
			fetch('https://motion-project.herokuapp.com/test/start', {
				method: 'POST',
				mode: 'CORS',
				headers: myHeaders
			})
				.then(response=>{
					expect(response.status).toBe(200);
					return fetch(baseUrl + '/create', {
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
			fetch(baseUrl + '/changeEmail', { method: 'POST', mode: 'CORS'})
				.then(response => {
				let status = response.status;
				expect(status).not.toBe(500);
				return fetch(baseUrl + '/changeLogin', { method: 'POST', mode: 'CORS'});
			})
				.then(response => {
					let status = response.status;
					expect(status).not.toBe(500);
					return fetch(baseUrl + '/changePassword', { method: 'POST', mode: 'CORS'});
				})
				.then(response => {
					let status = response.status;
					expect(status).not.toBe(500);
					done(true);
				})
		})

		it('should change user data, response http 200 and -1 code on correct requests', function (done) {
			fetch(baseUrl + '/changeLogin', {
				method: 'POST',
				mode: 'CORS',
				headers: myHeaders,
				body: JSON.stringify({login :'11test'})
			})
				//login
				.then(response => {
					let status = response.status;
					expect(status).toBe(200);
					return response.json();
				})
				.then(body => {
					expect(body.status).toBe(-1);
					return fetch(baseUrl + '/changeEmail', {
						method: 'POST',
						mode: 'CORS',
						headers: myHeaders,
						body: JSON.stringify({email:'testEmail@email.ru'})
					});
				})
				//email
				.then(response => {
					let status = response.status;
					expect(status).toBe(200);
					return response.json();
				})
				.then(body => {
					expect(body.status).toBe(-1);
					return fetch(baseUrl + '/changePassword', {
						method: 'POST',
						mode: 'CORS',
						headers: myHeaders,
						body: JSON.stringify({password:'password1234'})
					});
				})
				//password
				.then(response => {
					let status = response.status;
					expect(status).toBe(200);
					return response.json();
				})
				.then(body => {
					expect(body.status).toBe(-1);
					done(true);
				})

		});

		it('should response http code 200 and 605 on not correct requests', function (done) {
			fetch(baseUrl + '/changeLogin', {
				method: 'POST',
				mode: 'CORS',
				headers: myHeaders,
				body: JSON.stringify({login :'12'})
			})
				//login
				.then(response => {
					let status = response.status;
					expect(status).toBe(200);
					return response.json();
				})
				.then(body => {
					expect(body.status).toBe(605);
					return fetch(baseUrl + '/changeEmail', {
						method: 'POST',
						mode: 'CORS',
						headers: myHeaders,
						body: JSON.stringify({email:'testEmailemail.ru'})
					});
				})
				//email
				.then(response => {
					let status = response.status;
					expect(status).toBe(200);
					return response.json();
				})
				.then(body => {
					expect(body.status).toBe(605);
					return fetch(baseUrl + '/changePassword', {
						method: 'POST',
						mode: 'CORS',
						headers: myHeaders,
						body: JSON.stringify({password:'34'})
					});
				})
				//password
				.then(response => {
					let status = response.status;
					expect(status).toBe(200);
					return response.json();
				})
				.then(body => {
					expect(body.status).toBe(605);
					done(true);
				})
		})

	});

	// describe("User delete", function () {
    //
	// 	beforeEach(function (done) {
    //
	// 		const body = JSON.stringify({
	// 			login: "test111",
	// 			email: "test@test111.ru",
	// 			password: "password"
	// 		});
    //
	// 		fetch('https://motion-project.herokuapp.com/test/start', {
	// 			method: 'POST',
	// 			mode: 'CORS',
	// 			headers: myHeaders
	// 		})
	// 			.then(r => {
	// 				return fetch(baseUrl + '/create', {
	// 					method: 'POST',
	// 					mode: 'CORS',
	// 					headers: myHeaders,
	// 					body: body
	// 				})
	// 					.then(response => {
	// 						expect(response.status).toBe(200);
	// 						return fetch('https://motion-project.herokuapp.com/sessions/login', {
	// 							method: 'POST',
	// 							mode: 'CORS',
	// 							headers: myHeaders,
	// 							body: JSON.stringify({login_or_email: "test111", password: "password"})
	// 						})
	// 					})
	// 					.then(response => {
	// 						expect(response.status).toBe(200);
	// 						done(true);
	// 					})
	// 			})
    //
	// 	});
    //
	// 	it('should not response 500, even on request without body', function (done) {
	// 		fetch(baseUrl + '/delete', {
	// 			method: 'POST',
	// 			mode: 'CORS'
	// 		}).then(response => {
	// 			let status = response.status;
	// 			expect(status).not.toBe(500);
	// 			done(true);
	// 		})
	// 	});
    //
    //
    //
	// 	it('should delete user, response http 200 and -1 code on corrects requests', function (done) {
	// 		fetch(baseUrl + '/delete', {
	// 			method: 'POST',
	// 			mode: 'CORS'
	// 		})
	// 			.then(response => {
	// 				let status = response.status;
	// 				expect(status).not.toBe(500);
	// 				return response.json();
	// 			})
	// 			.then(body => {
	// 				expect(body.status).toBe(-1);
	// 			})
	// 	})
	// });

	it('test environment', function (done) {
		fetch('https://motion-project.herokuapp.com/test/start', {
			method: 'POST',
			mode: 'CORS',
			headers: myHeaders
		})
			.then(response=>{
				expect(response.status).toBe(200);
				done(true);
			})
	})
});

