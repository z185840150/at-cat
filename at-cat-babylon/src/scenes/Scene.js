// eslint-disable-next-line no-unused-vars
import Game from './../main'

class Scene {
  /** the game
   * @type {Game}
   */
  get game () { return this._game }
  set game (value) { this._game = value }
  /** scene name
   * @type {string}
   */
  get name () { return this._name }
  set name (value) { this._name = value }

  get loader () { return this._loader }
  set loader (value) { this._loader = value }

  constructor (game) {
    this._game = game
    this._loader = new Loader(this._game)
    this.init()
  }

  /** 初始化游戏场景 */
  init () {}

  run () {}
}

class Loader {
  /** the game
   * @type {Game}
   */
  get game () { return this._game }
  set game (value) { this._game = value }

  constructor (game) {
    this._game = game
  }

  gltf (path, name) { return BABYLON.SceneLoader.AppendAsync(`${path + name}/`, `${name}.gltf`, this.game.scene) }

  obj (path, name) { return BABYLON.SceneLoader.AppendAsync(`${path + name}/`, `${name}.obj`, this.game.scene) }

  _load (path, name, ext) {
    return BABYLON.SceneLoader.AppendAsync(`${path}/${name}`, `${name}.${ext}`, this.game.scene)
  }
}

export default Scene
