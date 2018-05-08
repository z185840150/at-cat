/**
 * 场景内对象的资源类
 *
 * @export
 * @class SceneObjectAssets
 */
export default class SceneObjectAssets {
  /**
   * 资源路径
   * @type {String}
   * @memberof SceneObjectAssets
   */
  get path () { return this._path }
  set path (val) { this._path = val }

  /**
   * 资源名称
   * @type {String}
   * @memberof SceneObjectAssets
   */
  get file () { return this._file }
  set file (val) { this._file = val }

  /**
   * 根节点资源名称
   * @type {String}
   * @memberof SceneObjectAssets
   */
  get root () { return this._root }
  set root (val) { this._root = val }

  /**
   * 子节点资源名称
   * @type {String[]}
   * @memberof SceneObjectAssets
   */
  get childs () { return this._childs }
  set childs (val) { this._childs = val }

  /**
   * SceneObjectAssets 构造函数
   * @param {String} path 资源路径
   * @param {String} file 资源名称
   * @param {String} root 根节点资源名称
   * @param {String[]} childs 子节点资源名称
   * @memberof SceneObjectAssets
   */
  constructor (path, file, root, childs) {
    this._path = path
    this._file = file
    this._root = root
    this._childs = childs
  }
}
