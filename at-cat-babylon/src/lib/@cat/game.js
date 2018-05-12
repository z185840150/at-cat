import BABYLON from 'babylonjs'

import {CatMaker, CatMesh, User} from './index' // eslint-disable-line

/**
 * 游戏类
 *
 * @export
 * @class Game
 */
export default class Game {
  /**
   * Canvas DOM 元素
   *
   * @type {HTMLCanvasElement}
   * @memberof Game
   */
  get canvas () { return this._canvas }
  set canvas (val) { this._canvas = val }
  /**
   * Babylon 引擎
   *
   * @type {BABYLON.Engine}
   * @memberof Game
   */
  get engine () { return this._engine }
  set engine (val) { this._engine = val }
  /**
   * 主场景
   *
   * @type {BABYLON.Scene}
   * @memberof Game
   */
  get scene () { return this._scene }
  set scene (val) { this._scene = val }
  /**
   * 主摄像机
   *
   * @type {BABYLON.Camera}
   * @memberof Game
   */
  get camera () { return this._camera }
  set camera (val) { this._camera = val }
  /**
   * 天空盒
   *
   * @type {BABYLON.Mesh}
   * @memberof Game
   */
  get skybox () { return this._skybox }
  set skybox (val) { this._skybox = val }
  /**
   * 主光源
   *
   * @type {BABYLON.Light}
   * @memberof Game
   */
  get light () { return this._light }
  set light (val) { this._light = val }
  /**
   * 主阴影
   *
   * @type {BABYLON.ShadowGenerator}
   * @memberof Game
   */
  get shadowGenerator () { return this._shadowGenerator }
  set shadowGenerator (val) { this._shadowGenerator = val }
  /**
   * 默认渲染管线
   *
   * @type {BABYLON.PostProcessRenderPipeline}
   * @memberof Game
   */
  get pipeline () { return this._pipeline }
  set pipeline (val) { this._pipeline = val }
  /**
   * 资源管理器
   *
   * @type {BABYLON.AssetsManager}
   * @memberof Game
   */
  get assetsManager () { return this._assetsManager }
  set assetsManager (val) { this._assetsManager = val }
  /**
   * 猫生成器
   *
   * @type {CatMaker}
   * @memberof Game
   */
  get catMaker () { return this._catMaker }
  set catMaker (val) { this._catMaker = val }
  /**
   * 所有的猫
   *
   * @type {CatMesh}
   *
   * @memberof Game
   */
  get cat () { return this._cat }
  set cat (val) { this._cat = val }
  /**
   * 用户
   *
   * @type {User}
   * @memberof Game
   */
  get user () { return this._user }
  set user (val) { this._user = val }

  /**
   * 构造函数
   *
   * @param {HTMLCanvasElement} canvas - Canvas DOM 元素，默认为：null
   * @memberof Game
   */
  constructor (canvas) {
    this.canvas = canvas
    this.init()
  }

  /**
   * 初始化
   *
   * @returns {Game} 自身
   * @readonly
   * @memberof Game
   */
  init () {
    this.initBefore()
    // 初始化引擎
    this._engine = new BABYLON.Engine(this.canvas, true, null, false)
    // 初始化场景
    this._scene = new BABYLON.Scene(this.engine)
    this._scene.clearColor = new BABYLON.Color4(0, 0, 0, 1)
    // 资源管理器
    this._assetsManager = new BABYLON.AssetsManager(this.scene)

    // 注册浏览器尺寸变更事件
    window.addEventListener &&
    window.addEventListener('resize', () => this.engine.resize())

    this.initAfter()
    return this
  }

  /**
   * 初始化 执行之前函数
   *
   * @type {function}
   * @memberof Game
   */
  initBefore () {}

  /**
   * 初始化 执行之后函数
   *
   * @type {function}
   * @memberof Game
   */
  initAfter () {}

  /**
   * 开始游戏
   *
   * @type {function}
   * @param {boolean} [debug=false] 是否开启Babylon JS Debug视图层，默认 false
   * @readonly
   * @memberof Game
   */
  start (debug = false) {
    this.startBefore()

    // 引擎开始循环渲染
    this.engine.runRenderLoop(() => this.scene.render())
    // 是否渲染Debug层
    debug && this.scene.debugLayer.show()

    this.startAfter()
  }

  /**
   * 开始游戏 之前执行函数
   *
   * @type {function}
   * @memberof Game
   */
  startBefore () {} // Interface

  /**
   * 开始游戏 之后执行函数
   *
   * @type {function}
   * @memberof Game
   */
  startAfter () {} // Interface
}
