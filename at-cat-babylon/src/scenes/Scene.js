// eslint-disable-next-line no-unused-vars
import Game from './../main'

class SceneObjectAssets {
  /** 资源路径
   * @type {string}
   */
  get path () { return this._path }
  set path (val) { this._path = val }

  /** 资源名称
   * @type {string}
   */
  get file () { return this._name }
  set file (val) { this._name = val }

  /** 资源名称 */
  get names () { return this._names }
  set names (val) { this._names = val }

  get root () { return this._root }
  set root (val) { this._root = val }
}

class SceneObject {
  /** 根节点
   * @type {BABYLON.Mesh}
   */
  get root () { return this._root }
  set root (val) { this._root = val }

  /** 子节点
   * @type {Map<string, BABYLON.Mesh>}
   */
  get childs () { return this._childs }
  set childs (val) { this._childs = val }

  /** 资源
   * @type {SceneObjectAssets}
   */
  get assets () { return this._assets }
  set assets (val) { this._assets = val }

  constructor (assets) {
    this._assets = assets || null
    this._root = null
    this._childs = new Map()
  }
}
class Scene {
  /** 游戏
   * @type {Game}
   */
  get game () { return this._game }
  set game (value) { this._game = value }
  /** 场景名称
   * @type {string}
   */
  get name () { return this._name }
  set name (value) { this._name = value }
  /** 加载器 */
  get loader () { return this._loader }
  set loader (value) { this._loader = value }
  /** 大纲
   * @type {Map<string, SceneObject>}
   */
  get outline () { return this._outline }
  set outline (val) { return this._outline }

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

export default {
  Scene,
  SceneObject,
  SceneObjectAssets
}
