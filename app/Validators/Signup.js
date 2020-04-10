'use strict';

class Signup {
  get rules() {
    return {
      name: 'required|min:4',
      username: 'required|unique:users,username',
      email: 'required|email|unique:users,email',
      password: 'required|min:4',
    };
  }

  get messages() {
    return {
      'name.required': 'You must provide a name.',
      'username.required': 'You must provide a username.',
      'username.unique': 'This username is already registered.',
      'email.required': 'You must provide a email address.',
      'email.email': 'You must provide a valid email address.',
      'email.unique': 'This email is already registered.',
      'password.required': 'You must provide a password',
    };
  }
}

module.exports = Signup;
