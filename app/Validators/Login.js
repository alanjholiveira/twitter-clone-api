'use strict';

class Login {
  get rules() {
    return {
      // validation rules
      email: 'required|email',
      password: 'required|min:4',
    };
  }

  get messages() {
    return {
      'email.required': 'You must provide a email address.',
      'email.email': 'You must provide a valid email address.',
      'password.required': 'You must provide a password',
    };
  }
}

module.exports = Login;
