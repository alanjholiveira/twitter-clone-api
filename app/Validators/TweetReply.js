'use strict';

class TweetReply {
  get rules() {
    return {
      reply: 'required|min:4',
    };
  }
}

module.exports = TweetReply;
