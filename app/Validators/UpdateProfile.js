'use strict';

class UpdateProfile {
  get rules() {
    return {
      name: 'required|min:4',
      username: 'required|min:4',
      email: 'required|email',
    };
  }

  get messages() {
    return {
      'name.required': 'You must provide a name.',
      'username.required': 'You must provide a username.',
      'email.required': 'You must provide a email address.',
      'email.email': 'You must provide a valid email address.',
    };
  }
}

module.exports = UpdateProfile;
