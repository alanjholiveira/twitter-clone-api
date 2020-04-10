'use strict';

const Tweet = use('App/Models/Tweet');
const Reply = use('App/Models/Reply');

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with tweets
 */
class TweetController {
  /**
   * Create/save a new tweet.
   * POST tweets
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {auth} ctx.auth
   * @param {Response} ctx.response
   */
  async store({ request, auth, response }) {
    try {
      const { tweetTxt } = request.body;
      // user auth currently
      const { user } = auth.current;

      // Create tweet to database
      const tweet = await Tweet.create({
        user_id: user.id,
        tweet: tweetTxt,
      });

      // fetch tweet's relations
      await tweet.loadMany(['user', 'favorites', 'replies']);

      return response.status(200).json({
        status: 'success',
        message: 'Tweet posted!',
        data: tweet,
      });
    } catch (error) {
      return response.status(400).json({
        status: 'error',
        message: error,
      });
    }
  }

  /**
   * Display a single tweet.
   * GET tweets/:id
   *
   * @param {object} ctx
   * @param {Response} ctx.response
   */
  async show({ params, response }) {
    try {
      const tweet = await Tweet.query()
        .where('id', params.id)
        .with('user')
        .with('replies')
        .with('replies.user')
        .with('favorites')
        .firstOrFail();

      return response.json({
        status: 'success',
        data: tweet,
      });
    } catch (error) {
      return response
        .status(404)
        .json({ status: 'error', message: 'Tweet not found' });
    }
  }

  /**
   * Reply a tweet
   *
   * @method reply
   *
   * @param  {Object} request
   * @param  {Object} auth
   * @param  {Object} params
   * @param  {Object} response
   *
   */
  async reply({ request, auth, params, response }) {
    try {
      // get id params
      const { id } = params;

      // user currently auth
      const { user } = auth.current;

      // get tweet by ID
      const tweet = await Tweet.find(id);

      // persist to database
      const reply = await Reply.create({
        user_id: user.id,
        tweet_id: tweet.id,
        reply: request.input('reply'),
      });

      // fetch user that made the reply
      await reply.load('user');

      return response.status(200).json({
        status: 'success',
        message: 'Reply posted!',
        data: reply,
      });
    } catch (error) {
      return response.status(400).json({
        status: 'error',
        message: error,
      });
    }
  }

  /**
   * Delete a tweet with id.
   * DELETE tweets/:id
   *
   * @param {object} ctx
   * @param {params} ctx.params
   * @param {auth} ctx.auth
   * @param {Response} ctx.response
   */
  async destroy({ params, auth, response }) {
    try {
      // user current auth
      const { user } = auth.current;

      // query tweet
      const tweet = await Tweet.query()
        .where('user_id', user.id)
        .where('id', params.id)
        .firstOrFail();

      // delet tweet
      await tweet.delete();

      return response.status(200).json({
        status: 'success',
        message: 'Tweet deleted!',
      });
    } catch (err) {
      return response.status(400).json({
        status: 'error',
        message: 'Error not delete',
        err,
      });
    }
  }
}

module.exports = TweetController;
