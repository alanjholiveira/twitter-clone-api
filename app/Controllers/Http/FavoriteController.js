'use strict';

const Favorite = use('App/Models/Favorite');

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with replies
 */
class FavoriteController {
  /**
   * Create Favorite specified tweet
   *
   * @method store
   *
   * @param  {Object} request
   * @param  {Object} auth
   * @param  {Object} response
   *
   */
  async store({ request, auth, response }) {
    try {
      const { tweetId } = request.body;

      // user currently auth
      const { user } = auth.current;

      const favorite = await Favorite.findOrCreate(
        { user_id: user.id, tweet_id: tweetId },
        { user_id: user.id, tweet_id: tweetId }
      );

      return response.status(200).json({
        status: 'success',
        data: favorite,
      });
    } catch (error) {
      return response.status(400).json({
        status: 'error',
        message: error,
      });
    }
  }

  /**
   * Unfavorite specified tweet
   *
   * @method unFavorite
   *
   * @param  {Object} params
   * @param  {Object} auth
   * @param  {Object} response
   *
   */
  async unFavorite({ params, auth, response }) {
    // user currently auth
    const { user } = auth.current;

    // fetch favorite
    await Favorite.query()
      .where('user_id', user.id)
      .where('tweet_id', params.id)
      .delete();

    return response.status(200).json({
      status: 'success',
      data: null,
    });
  }
}

module.exports = FavoriteController;
