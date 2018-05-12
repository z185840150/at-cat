/**
 * 用户
 *
 * @class User
 */
export default class User {
  /**
   * 用户令牌
   *
   * @type {string}
   * @memberof User
   */
  get token () { return this._token }
  set token (val) { this._token = val }

  /**
   * 构造函数
   * @param {string} token
   * @memberof User
   */
  constructor (token) {
    this._token = token
  }
}
