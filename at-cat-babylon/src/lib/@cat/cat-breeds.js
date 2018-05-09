/**
 * 猫的种族
 *
 * @export
 * @class CatBreeds
 */
export default class CatBreeds {
  /**
   * 构造函数
   *
   * @param {any} json 后端过来的种族JSON
   * @memberof CatBreeds
   */
  constructor (json) {
    Object.keys(json).map(key => {
      this[`_${key}`] = json[key]
    })
  }

  // #region get properties
  get siamese () { return this._siamese }
  get ragdoll () { return this._ragdoll }
  get scottishFold () { return this._scottishFold }
  get britishShorthair () { return this._britishShorthair }
  get persian () { return this._persian }
  get russianBlue () { return this._russianBlue }
  get americanShorthair () { return this._americanShorthair }
  get exotic () { return this._exotic }
  get norwegianForest () { return this._norwegianForest }
  get bombay () { return this._bombay }
  get maineCoon () { return this._maineCoon }
  get egyptianMau () { return this._egyptianMau }
  get canadianHairless () { return this._canadianHairless }
  // #endregion

  // #region set properties
  set siamese (num) { this._siamese = num }
  set ragdoll (num) { this._ragdoll = num }
  set scottishFold (num) { this._scottishFold = num }
  set britishShorthair (num) { this._britishShorthair = num }
  set persian (num) { this._persian = num }
  set russianBlue (num) { this._russianBlue = num }
  set americanShorthair (num) { this._americanShorthair = num }
  set exotic (num) { this._exotic = num }
  set norwegianForest (num) { this._norwegianForest = num }
  set bombay (num) { this._bombay = num }
  set maineCoon (num) { this._maineCoon = num }
  set egyptianMau (num) { this._egyptianMau = num }
  set canadianHairless (num) { this._canadianHairless = num }
  // #endregion
}
