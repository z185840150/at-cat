/**
 * 游戏类
 *
 * @export
 * @class Game
 */
export default class Game {
  /**
   * Canvas DOM 元素
   * @type {HTMLCanvasElement}
   * @memberof Game
   */
  get canvas () { return this._canvas }
  /**
   * Babylon 引擎
   * @type {BABYLON.Engine}
   * @memberof Game
   */
  get engine () { return this._engine }
  /**
   * 主场景
   * @type {BABYLON.Scene}
   * @memberof Game
   */
  get scene () { return this._scene }
  /**
   * 主摄像机
   * @type {BABYLON.Camera}
   * @memberof Game
   */
  get camera () { return this._camera }
  /**
   * 天空盒
   * @type {BABYLON.Mesh}
   * @memberof Game
   */
  get skybox () { return this._skybox }
  /**
   * 主光源
   * @type {BABYLON.Light}
   * @memberof Game
   */
  get light () { return this._light }
  /**
   * 主阴影
   * @type {BABYLON.ShadowGenerator}
   * @memberof Game
   */
  get shadowGenerator () { return this._shadowGenerator }
  /**
   * 默认渲染管线
   * @type {BABYLON.PostProcessRenderPipeline}
   * @memberof Game
   */
  get pipeline () { return this._pipeline }
  /**
   * 资源管理器
   * @type {BABYLON.AssetsManager}
   * @memberof Game
   */
  get assetsManager () { return this._assetsManager }
  /**
   * 获取自身是否初始化
   * @type {Boolean}
   * @readonly
   * @memberof Game
   */
  get initialized () {
    return true &&
    this._canvas &&
    this._engine &&
    this._scene &&
    this._camera &&
    this._skybox &&
    this._light &&
    this._shadowGenerator &&
    this._pipeline &&
    this._assetsManager
  }

  set canvas (val) { this._canvas = val }
  set engine (val) { this._engine = val }
  set scene (val) { this._scene = val }
  set camera (val) { this._camera = val }
  set skybox (val) { this._skybox = val }
  set light (val) { this._light = val }
  set shadowGenerator (val) { this._shadowGenerator = val }
  set pipeline (val) { this._pipeline = val }
  set assetsManager (val) { this._assetsManager = val }

  /**
   * 构造函数
   *
   * @param {HTMLCanvasElement} [canvas=document.getElementById('renderCanvas')] - Canvas DOM 元素，默认为：document.getElementById('renderCanvas')
   * @param {Boolean} init - 是否执行初始化，默认：true
   * @memberof Game
   */
  constructor (canvas = document.getElementById('renderCanvas'), init = true) {
    this.canvas = canvas
  }

  /**
   * 初始化
   * @returns {Game} 自身
   * @memberof Game
   */
  init () {
    // 初始化引擎
    this.engine && this.engine.dispose()
    this.engine = new BABYLON.Engine(this.canvas, true, null, false)
    // 初始化场景
    this.scene = new BABYLON.Scene(this.engine)
    this.scene.clearColor = new BABYLON.Color4(0, 0, 0, 1)
    this.initOverride()
    // 尺寸变更事件
    window.addEventListener('resize', () => this.engine.resize())
    return this
  }

  /**
   * 初始化函数复写
   *
   * @memberof Game
   */
  initOverride () {} // Interface

  /**
   * 开始游戏
   *
   * @param {boolean} [debug=false] 开启Debug视图层。默认 false
   * @memberof Game
   */
  start (debug = false) {
    if (!this.initialized) this.init() // 判断是否初始化
    this.engine.runRenderLoop(() => this.scene.render()) // 引擎开始循环渲染
    debug && this.scene.debugLayer.show() // 是否渲染Debug层
    this.startOverride()
  }

  /**
   * 开始游戏函数复写
   *
   * @memberof Game
   */
  startOverride () {} // Interface
}
