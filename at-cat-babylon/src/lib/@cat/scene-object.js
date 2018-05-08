import BABYLON from 'babylonjs'
import Game from './game' // eslint-disable-line no-unused-vars

const [{ImportMeshAsync: asyncImport}] = [BABYLON.SceneLoader]

/**
 * 场景内的对象
 *
 * @export
 * @class SceneObject
 */
export default class SceneObject {
  /**
   * 游戏
   *
   * @type {Game}
   * @memberof SceneObject
   */
  get game () { return this._game }
  set game (value) { this._game = value }
  /**
   * 名称
   *
   * @type {string}
   * @memberof SceneObject
   */
  get name () { return this._name }
  set name (val) { this._name = val }
  /**
   * 根节点
   *
   * @type {BABYLON.Mesh}
   * @memberof SceneObject
   */
  get root () { return this._root }
  set root (val) { this._root = val }
  /**
   * 子节点
   *
   * @type {Map<string, BABYLON.Mesh>}
   * @memberof SceneObject
   */
  get childs () { return this._childs }
  set childs (val) { this._childs = val }
  /**
   * 资源
   *
   * @type {SceneObjectAssets}
   * @memberof SceneObject
   */
  get assets () { return this._assets }
  set assets (val) { this._assets = val }
  /**
   * 对象是否可见
   *
   * @type {boolean}
   * @memberof SceneObject
   */
  get display () { return this._display }
  set display (val) {
    if (this._display !== val) {
      this._display = val
      this.root.visibility = val ? 1 : 0
      for (let mesh of this.childs.values()) mesh.visibility = val ? 1 : 0
    }
  }
  /**
   * 资源已经被加载
   *
   * @type {boolean}
   * @memberof SceneObject
   */
  get assetsIsLoaded () { return this._assetsIsLoaded }
  set assetsIsLoaded (val) { this._assetsIsLoaded = val }

  /**
   * 构造函数
   *
   * @param {Game} game 游戏
   * @param {String} name 名称
   * @param {SceneObjectAssets} assets 资源实例
   * @memberof SceneObject
   */
  constructor (game, name, assets) {
    this._game = game
    this._name = name
    this._root = null
    this._childs = new Map()
    this._assets = assets || null
  }

  /**
   * 异步加载资源进度函数
   *
   * @typedef {function(BABYLON.SceneLoaderProgressEvent)} loadAssetsCallback
   * @callback loadAssetsCallback
   * @param {BABYLON.SceneLoaderProgressEvent} 进度事件
   */
  /**
   * 异步加载资源
   * @param {boolean} [justChilds=false] 仅加载子节点包含的名称，默认 false
   * @param {loadAssetsCallback} onProgress 进度函数
   */
  async loadAssetsAsync (justChilds = false, onProgress = e => {}) {
    const [{scene}, {path, file, root, childs}] = [this.game, this.assets]
    await asyncImport(justChilds ? childs : '', path, file, scene, onProgress)
      .then(({meshes: ms}) => {
        ms.map(m => {
          if (root === m.name) this.root = m
          else if (childs.includes(m.name)) this.childs.set(m.name, m)
        })
      })
    return this
  }
}
