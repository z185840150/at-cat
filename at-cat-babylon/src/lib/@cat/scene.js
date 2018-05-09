// eslint-disable-next-line no-unused-vars
import {Game, SceneObject, Outline} from './index'

/**
 * 场景
 *
 * @class Scene
 */
class Scene {
  /**
   * 游戏
   *
   * @type {Game}
   * @memberof Scene
   */
  get game () { return this._game }
  set game (value) { this._game = value }
  /**
   * 场景名称
   *
   * @type {string}
   * @memberof Scene
   */
  get name () { return this._name }
  set name (value) { this._name = value }
  /**
   * 大纲
   *
   * @type {Outline}
   * @memberof Scene
   */
  get outline () { return this._outline }
  set outline (val) { return this._outline }

  /**
   * 构造函数
   * @param {Game} game 游戏
   * @param {string} name 场景名称
   * @memberof Scene
   */
  constructor (game, name) {
    this._game = game
    this._name = name
    this._outline = new Outline()
    this.init()
  }

  /**
   * 初始化游戏场景
   *
   * @return {Scene} 自身
   * @memberof Scene
   */
  init () {
    this.initOutlineOverride()
    this.initOverride()
    return this
  }

  /**
   * 复写初始化大纲函数
   *
   * @memberof Scene
   */
  initOutlineOverride () {
  }

  /**
   * 复写初始化函数
   *
   * @memberof Scene
   */
  initOverride () {
  }

  /**
   * 运行
   *
   * @memberof Scene
   */
  run () {}

  /**
   * 异步加载场景大纲内所有资源
   * @memberof Scene
   */
  async loadAssetsAsync (onProgress) {
    const [{outline}] = [this]
    let percents = new Map() // 进度百分比

    for (let [name, obj] of outline) {
      await obj.loadAssetsAsync(false, ({lengthComputable: c, loaded: l, total: t, percent: p}) => {
        percents.set(name, p)
        let percent = 0
        for (let _p of percents.values()) percent += _p
        onProgress((percent / outline.size).toFixed(2))
      }).then(root => {})
    }
    return this
  }
}

export default Scene
