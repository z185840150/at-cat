// eslint-disable-next-line no-unused-vars
import Game from './game'
import Outline from './outline'

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
   * @type {OutLine<string, SceneObject>}
   * @memberof Scene
   */
  get outline () { return this._outline }
  set outline (val) { return this._outline }

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
  async load () {
    const [{outline}] = [this]

    for (let obj of outline.values()) {
      await obj.loadAssetsAsync(false, ({lengthComputable: c, loaded: l, total: t}) => {
      }).then(house => {
        console.log(outline.allLoaded)
      })
    }
  }
}

export default Scene
