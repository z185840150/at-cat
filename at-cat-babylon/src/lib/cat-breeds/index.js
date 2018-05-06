export default class Breeds {
  constructor () {
    this._siamese = 0
    this._ragdoll = 0
    this._scottishFold = 0
    this._britishShorthair = 0
    this._persian = 0
    this._russianBlue = 0
    this._americanShorthair = 0
    this._exotic = 0
    this._norwegianForest = 0
    this._bombay = 0
    this._maineCoon = 0
    this._egyptianMau = 0
    this._canadianHairless = 0
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
