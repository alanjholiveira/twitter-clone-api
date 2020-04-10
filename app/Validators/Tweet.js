'use strict';

class Tweet {
  get rules() {
    return {
      tweetTxt: 'required|min:4',
    };
  }
}

module.exports = Tweet;
