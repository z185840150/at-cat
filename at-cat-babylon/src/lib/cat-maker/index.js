import * as BABYLON from 'babylonjs'
// eslint-disable-next-line no-unused-vars
import Game from './../../main'
// eslint-disable-next-line no-unused-vars
import Gene from './../cat-gene'

const POSITION_KIND = BABYLON.VertexBuffer.PositionKind
const TARGET_NAMES = (
  'body-fat-max|body-fat-min|' +
  'head-angle-max|head-angle-min')
  .split('|')

class CatMaker {
  /** 游戏
   * @type {Game}
   */
  get game () { return this._game }
  set game (val) { this._game = val }
  /** 基因
   * @type {Gene}
   */
  get genes () { return this._genes }
  set genes (val) { this._genes = val }
  /** 全部目标文件
   * @type {Object}
   */
  get targets () { return this._targets }
  set targets (val) { this._targets = val }
  /** 全部已生成猫的模型
   * @type {BABYLON.Mesh[]}
   */
  get meshes () { return this._meshes }
  set meshs (val) { this._meshs = val }
  /** 基本模型
   * @type {BABYLON.Mesh}
   */
  get base () { return this._base }
  set base (val) { this._base = val }
  /** 基本模型Position数据
   * @type {Number[]}
   */
  get basePosition () { return this._basePosition }
  set basePosition (val) { this._basePosition = val }
  /** 目标点文件全部就绪 */
  get targetsIsReady () { return this._targetsIsReady }
  set targetsIsReady (val) { this._targetsIsReady = val }

  /** 构造函数
   * @param {Game} game
   */
  constructor (game) {
    this._game = game
    this._genes = []
    this._targets = {}
    this._targetsIsReady = false
    this._base = null
    this._basePosition = []
    this._meshes = {}
  }

  /** 加载资源回调函数
   * @typedef {function(CatMaker)} loadAssetsCallback
   * @callback loadAssetsCallback
   * @param {CatMaker} 自身
   */
  /** 加载资源
   * @param {loadAssetsCallback} callback 回调
   * @returns {CatMaker} 返回自身
   */
  loadAssets (callback) {
    const GAME = this.game
    const ASSETS_MANAGER = GAME.assetsManager
    const TARGETS = this.targets
    const PATH = './static/assets/resources/cat/target/'
    const BASE_FILE_PATH = './static/assets/resources/cat/babylon/'
    const BASE_FILE_NAME = 'cat-target.babylon'
    const BASE_NAME = 'cat_body'
    const POSITION_KIND = BABYLON.VertexBuffer.PositionKind

    // 资源管理器初始化
    ASSETS_MANAGER.reset()

    // 循环将目标点文件加入资源管理器任务列队
    TARGET_NAMES.map((name, i) => {
      let task = ASSETS_MANAGER.addTextFileTask(name, `${PATH + name}.target`)
      task.onSuccess = ({text}) => {
        TARGETS[name] = {}
        text.split('\n').map((line, i) => {
          let arr = line.split(' ')
          TARGETS[name][Number(arr[0])] = [Number(arr[1]), Number(arr[2]), Number(arr[3])]
        })
      }
    })

    // 将基本模型加入资源管理器任务列队
    let task = ASSETS_MANAGER.addMeshTask('base mesh task', BASE_NAME, BASE_FILE_PATH, BASE_FILE_NAME)
    task.onSuccess = ({loadedMeshes}) => {
      this.base = loadedMeshes[0]
      this.base.visibility = 0
      this.basePosition = [].concat(this.base.getVerticesData(POSITION_KIND))
    }

    ASSETS_MANAGER.load() // 资源管理器启动加载任务
    ASSETS_MANAGER.onTaskSuccessObservable.add(task => {})
    // 资源管理器任务全部结束回调
    ASSETS_MANAGER.onTasksDoneObservable.add(tasks => {
      this.targetsIsReady = true
      callback(this) // eslint-disable-line
    })

    return this
  }

  /** 创建猫模型的Promise返回项
   * @typedef {Object} createPromiseObject
   * @property {CatMaker} maker -自身
   * @property {BABYLON.Mesh} mesh -自身
   */
  /** 创建猫
   * @param {string} name -名称
   * @param {Gene} gene -基因
   * @returns {Promise.<createPromiseObject, Error>} Promise
   */
  async create (name, gene) {
    this.genes[name] = gene
    this.rebuild(name)
    return { maker: this, mesh: this.mesh(name) }
  }

  /** 根据猫的名称获取Mesh
   * @returns {BABYLON.Mesh}
   */
  mesh (name) {
    return this.meshes[name]
  }

  /** 重建模型
   * @param {string} name 基因名称
   */
  rebuild (name) {
    // 判断目标文件是否就绪、自身源网格是否就绪、基因是否存在
    if (this.targetsIsReady && this._base && this.genes[name]) {
      // 检测是否存在模型
      if (!this.meshes[name]) this.meshes[name] = this.base.clone(`__${name}_MESH__`)
      if (!this.meshes[name].skeleton) this.meshes[name].skeleton = this.base.skeleton.clone(`__${name}_SLELETON__`)

      const mesh = this.mesh(name)

      mesh.visibility = 0

      this.COMPUTE_AGE(new Array(0).concat(this.basePosition), name)
        .then(pos => this.COMPUTE_SEX(pos, name))
        .then(pos => this.COMPUTE_FAT(pos, name))
        .then(pos => this.COMPUTE_WEIGHT(pos, name))
        .then(pos => this.COMPUTE_HEIGHT(pos, name))
        // 头部
        .then(pos => this.COMPUTE_HEAD_AGE(pos, name))
        .then(pos => this.COMPUTE_HEAD_FAT(pos, name))
        .then(pos => this.COMPUTE_HEAD_ANGLE(pos, name))
        .then(pos => this.COMPUTE_HEAD_OVAL(pos, name))
        .then(pos => this.COMPUTE_HEAD_ROUND(pos, name))
        .then(pos => this.COMPUTE_HEAD_RECTANGULAR(pos, name))
        .then(pos => this.COMPUTE_HEAD_SQUARE(pos, name))
        .then(pos => this.COMPUTE_HEAD_TRIANGULAR(pos, name))
        .then(pos => this.COMPUTE_HEAD_TRIANGULAR_INVERTED(pos, name))
        .then(pos => this.COMPUTE_HEAD_DIAMOND(pos, name))
        .then(pos => this.COMPUTE_HEAD_PARIETAL_SCALE_DEPTH(pos, name))
        .then(pos => this.COMPUTE_HEAD_SCALE_DEPTH(pos, name))
        .then(pos => this.COMPUTE_HEAD_SCALE_HORIZONTALLY(pos, name))
        .then(pos => this.COMPUTE_HEAD_SCALE_VERTICALLY(pos, name))
        .then(pos => this.COMPUTE_HEAD_MOVE_DEPTH(pos, name))
        .then(pos => this.COMPUTE_HEAD_MOVE_HORIZONTALLY(pos, name))
        .then(pos => this.COMPUTE_HEAD_MOVE_VERTICALLY(pos, name))
        // 额头
        .then(pos => this.COMPUTE_FOREHEAD_BULGE(pos, name))
        .then(pos => this.COMPUTE_FOREHEAD_SCALE_VERTICALLY(pos, name))
        .then(pos => this.COMPUTE_FOREHEAD_CRANIC_SHAPE(pos, name))
        .then(pos => this.COMPUTE_FOREHEAD_TEMPLE_BULGE(pos, name))
        // 眉骨
        .then(pos => this.COMPUTE_EYEBROWS_BULGE(pos, name))
        .then(pos => this.COMPUTE_EYEBROWS_ANGLE(pos, name))
        .then(pos => this.COMPUTE_EYEBROWS_MOVE_VERTICALLY(pos, name))
        // 颈部
        .then(pos => this.COMPUTE_NECK_DOUBLE(pos, name))
        .then(pos => this.COMPUTE_NECK_SCALE_DEPTH(pos, name))
        .then(pos => this.COMPUTE_NECK_SCALE_DEPTH_OF_NAPE(pos, name))
        .then(pos => this.COMPUTE_NECK_SCALE_HORIZONTALLY(pos, name))
        .then(pos => this.COMPUTE_NECK_SCALE_VERTICALLY(pos, name))
        .then(pos => this.COMPUTE_NECK_MOVE_DEPTH(pos, name))
        .then(pos => this.COMPUTE_NECK_MOVE_HORIZONTALLY(pos, name))
        .then(pos => this.COMPUTE_NECK_MOVE_VERTICALLY(pos, name))
        // 眼睛
        .then(pos => this.COMPUTE_EYE_BAG_VOLUME(pos, name))
        .then(pos => this.COMPUTE_EYE_BAG_DISTORSION(pos, name))
        .then(pos => this.COMPUTE_EYE_BAG_HEIGHT(pos, name))
        .then(pos => this.COMPUTE_EYE_FOLD_ANGLE(pos, name))
        .then(pos => this.COMPUTE_EYE_FOLD_VOLUME(pos, name))
        .then(pos => this.COMPUTE_EYE_EPICANTHUS(pos, name))
        .then(pos => this.COMPUTE_EYE_SCALEHEIGHT_0(pos, name))
        .then(pos => this.COMPUTE_EYE_SCALEHEIGHT_1(pos, name))
        .then(pos => this.COMPUTE_EYE_SCALEHEIGHT_2(pos, name))
        .then(pos => this.COMPUTE_EYE_SCALEHEIGHT_3(pos, name))
        .then(pos => this.COMPUTE_EYE_SCALEHEIGHT_4(pos, name))
        .then(pos => this.COMPUTE_EYE_MOVE_OUTER_CORNER_HORIZONTALLY(pos, name))
        .then(pos => this.COMPUTE_EYE_MOVE_INNER_CORNER_HORIZONTALLY(pos, name))
        .then(pos => this.COMPUTE_EYE_MOVE_OUTER_CORNER_VERTICALLY(pos, name))
        .then(pos => this.COMPUTE_EYE_MOVE_INNER_CORNER_VERTICALLY(pos, name))
        .then(pos => this.COMPUTE_EYE_MOVE_HORIZONTALLY(pos, name))
        .then(pos => this.COMPUTE_EYE_MOVE_VERTICALLY(pos, name))
        .then(pos => this.COMPUTE_EYE_SCALE(pos, name))
        // 鼻子
        .then(pos => this.COMPUTE_NOSE_MOVE_VERTICALLY(pos, name))
        .then(pos => this.COMPUTE_NOSE_MOVE_HORIZONTALLY(pos, name))
        .then(pos => this.COMPUTE_NOSE_MOVE_DEPTH(pos, name))
        .then(pos => this.COMPUTE_NOSE_SCALE_VERTICALLY(pos, name))
        .then(pos => this.COMPUTE_NOSE_SCALE_HORIZONTALLY(pos, name))
        .then(pos => this.COMPUTE_NOSE_SCALE_DEPTH(pos, name))
        .then(pos => this.COMPUTE_NOSE_SCALE_NOSTRILS_WIDTH(pos, name))
        .then(pos => this.COMPUTE_NOSE_TIP_WIDTH(pos, name))
        .then(pos => this.COMPUTE_NOSE_MOVE_BASE_VERTICALLY(pos, name))
        .then(pos => this.COMPUTE_NOSE_SCALE_WIDTH_0(pos, name))
        .then(pos => this.COMPUTE_NOSE_SCALE_WIDTH_1(pos, name))
        .then(pos => this.COMPUTE_NOSE_SCALE_WIDTH_2(pos, name))
        .then(pos => this.COMPUTE_NOSE_COMPRESSION(pos, name))
        .then(pos => this.COMPUTE_NOSE_CURVE(pos, name))
        .then(pos => this.COMPUTE_NOSE_GREEK(pos, name))
        .then(pos => this.COMPUTE_NOSE_HUMP(pos, name))
        .then(pos => this.COMPUTE_NOSE_VOLUME(pos, name))
        .then(pos => this.COMPUTE_NOSE_NOSTRILS_ANGLE(pos, name))
        .then(pos => this.COMPUTE_NOSE_MOVE_TIP_VERTICALLY(pos, name))
        .then(pos => this.COMPUTE_NOSE_SEPTUM_ANGLE(pos, name))
        .then(pos => this.COMPUTE_NOSE_SCALE_NOSTRILS_FLARING(pos, name))
        // 嘴巴

        .then(pos => mesh.setVerticesData(POSITION_KIND, pos)) // 更新顶点
        .then(() => { mesh.visibility = 1 }) // 设置渲染
    }
  }

  /** 重建全部模型 */
  rebuildAll () {
    if (this.targetsIsReady && this._base && this._genes.length > 0) {
      this._genes.map((gene, i) => {
        this.rebuild(i)
      })
    }
  }

  clamp (v, min, max) {
    return v > max ? max : v < min ? min : v
  }

  /** 计算模型Promise返回项
   * @typedef {Number[]} computePromiseObject
   */
  /** 计算年龄
   * @param {*} pos
   * @param {*} name
   */
  async COMPUTE_AGE (pos, name) { return pos }
  /** 计算性别
   * @param {*} pos
   * @param {*} name
   */
  async COMPUTE_SEX (pos, name) { return pos }
  /** 计算体脂率
   * @param {number[]} pos
   * @param {string} name
   * @returns {Promise.<computePromiseObject, Error>} Promise
   * @memberof CatMaker
   */
  async COMPUTE_FAT (pos, name) {
    const GENE = 'fatRate'
    const TARGETS = this.targets
    const BASE_POSITION = this.basePosition
    const VALUE = this.clamp(this.genes[name][GENE], 0, 1)
    const NAME = VALUE < 0.5 ? 'body-fat-min' : 'body-fat-max'
    const LERP = VALUE < 0.5 ? 1 - 2 * VALUE : 2 * VALUE - 1

    for (let i in TARGETS[NAME]) {
      pos[i * 3 + 0] += (TARGETS[NAME][i][0] - BASE_POSITION[i * 3 + 0]) * LERP
      pos[i * 3 + 1] += (TARGETS[NAME][i][1] - BASE_POSITION[i * 3 + 1]) * LERP
      pos[i * 3 + 2] += (TARGETS[NAME][i][2] - BASE_POSITION[i * 3 + 2]) * LERP
    }

    return pos
  }
  /** 计算肥胖度
   * @param {*} pos
   * @param {*} name
   */
  async COMPUTE_WEIGHT (pos, name) { return pos }
  /** 计算肥高度
   * @param {*} pos
   * @param {*} name
   */
  async COMPUTE_HEIGHT (pos, name) { return pos }
  /** 计算肥面部年龄
   * @param {*} pos
   * @param {*} name
   */
  async COMPUTE_HEAD_AGE (pos, name) { return pos }
  /** 计算肥面部肥胖度
   * @param {*} pos
   * @param {*} name
   */
  async COMPUTE_HEAD_FAT (pos, name) { return pos }
  /** 计算肥面部角度
   * @param {*} pos
   * @param {*} name
   */
  async COMPUTE_HEAD_ANGLE (pos, name) { return pos }
  /** 计算肥面部椭圆形
   * @param {*} pos
   * @param {*} name
   */
  async COMPUTE_HEAD_OVAL (pos, name) { return pos }
  /** 计算肥面部圆形
   * @param {*} pos
   * @param {*} name
   */
  async COMPUTE_HEAD_ROUND (pos, name) { return pos }
  /** 计算肥面部矩形
   * @param {*} pos
   * @param {*} name
   */
  async COMPUTE_HEAD_RECTANGULAR (pos, name) { return pos }
  /** 计算肥面部正方形
   * @param {*} pos
   * @param {*} name
   */
  async COMPUTE_HEAD_SQUARE (pos, name) { return pos }
  /** 计算肥面部三角形
   *
   * @param {any} pos
   * @param {any} name
   * @returns
   * @memberof CatMaker
   */
  async COMPUTE_HEAD_TRIANGULAR (pos, name) { return pos }
  /** 计算肥面部倒三角形
   * @param {*} pos
   * @param {*} name
   */
  async COMPUTE_HEAD_TRIANGULAR_INVERTED (pos, name) { return pos }
  /** 计算肥面部菱形
   * @param {*} pos
   * @param {*} name
   */
  async COMPUTE_HEAD_DIAMOND (pos, name) { return pos }
  /** 计算头顶缩放深度
   * @param {*} pos
   * @param {*} name
   */
  async COMPUTE_HEAD_PARIETAL_SCALE_DEPTH (pos, name) { return pos }
  /** 计算头部缩放深度
   * @param {*} pos
   * @param {*} name
   */
  async COMPUTE_HEAD_SCALE_DEPTH (pos, name) { return pos }
  /** 计算头部水平缩放
   * @param {*} pos
   * @param {*} name
   */
  async COMPUTE_HEAD_SCALE_HORIZONTALLY (pos, name) { return pos }
  /** 计算头部垂直缩放
   * @param {*} pos
   * @param {*} name
   */
  async COMPUTE_HEAD_SCALE_VERTICALLY (pos, name) { return pos }
  /** 计算头部深度位移
   * @param {*} pos
   * @param {*} name
   */
  async COMPUTE_HEAD_MOVE_DEPTH (pos, name) { return pos }
  /** 计算头部水平位移
   * @param {*} pos
   * @param {*} name
   */
  async COMPUTE_HEAD_MOVE_HORIZONTALLY (pos, name) { return pos }
  /** 计算头部垂直位移
   * @param {*} pos
   * @param {*} name
   */
  async COMPUTE_HEAD_MOVE_VERTICALLY (pos, name) { return pos }
  /** 计算额头凸起
   * @param {*} pos
   * @param {*} name
   */
  async COMPUTE_FOREHEAD_BULGE (pos, name) { return pos }
  /** 计算额头垂直缩放
   * @param {*} pos
   * @param {*} name
   */
  async COMPUTE_FOREHEAD_SCALE_VERTICALLY (pos, name) { return pos }
  /** 计算额头颅骨凸起
   * @param {*} pos
   * @param {*} name
   */
  async COMPUTE_FOREHEAD_CRANIC_SHAPE (pos, name) { return pos }
  /** 计算额头太阳穴凸起
   * @param {*} pos
   * @param {*} name
   */
  async COMPUTE_FOREHEAD_TEMPLE_BULGE (pos, name) { return pos }
  /** 计算眉骨凸起
   * @param {*} pos
   * @param {*} name
   */
  async COMPUTE_EYEBROWS_BULGE (pos, name) { return pos }
  /** 计算眉骨角度
   * @param {*} pos
   * @param {*} name
   */
  async COMPUTE_EYEBROWS_ANGLE (pos, name) { return pos }
  /** 计算眉骨垂直位移
   * @param {*} pos
   * @param {*} name
   */
  async COMPUTE_EYEBROWS_MOVE_VERTICALLY (pos, name) { return pos }

  async COMPUTE_NECK_DOUBLE (pos, name) { return pos }
  async COMPUTE_NECK_SCALE_DEPTH (pos, name) { return pos }
  async COMPUTE_NECK_SCALE_DEPTH_OF_NAPE (pos, name) { return pos }
  async COMPUTE_NECK_SCALE_HORIZONTALLY (pos, name) { return pos }
  async COMPUTE_NECK_SCALE_VERTICALLY (pos, name) { return pos }
  async COMPUTE_NECK_MOVE_DEPTH (pos, name) { return pos }
  async COMPUTE_NECK_MOVE_HORIZONTALLY (pos, name) { return pos }
  async COMPUTE_NECK_MOVE_VERTICALLY (pos, name) { return pos }

  async COMPUTE_EYE_BAG_VOLUME (pos, name) { return pos }
  async COMPUTE_EYE_BAG_DISTORSION (pos, name) { return pos }
  async COMPUTE_EYE_BAG_HEIGHT (pos, name) { return pos }
  async COMPUTE_EYE_FOLD_ANGLE (pos, name) { return pos }
  async COMPUTE_EYE_FOLD_VOLUME (pos, name) { return pos }
  async COMPUTE_EYE_EPICANTHUS (pos, name) { return pos }
  async COMPUTE_EYE_SCALEHEIGHT_0 (pos, name) { return pos }
  async COMPUTE_EYE_SCALEHEIGHT_1 (pos, name) { return pos }
  async COMPUTE_EYE_SCALEHEIGHT_2 (pos, name) { return pos }
  async COMPUTE_EYE_SCALEHEIGHT_3 (pos, name) { return pos }
  async COMPUTE_EYE_SCALEHEIGHT_4 (pos, name) { return pos }
  async COMPUTE_EYE_MOVE_OUTER_CORNER_HORIZONTALLY (pos, name) { return pos }
  async COMPUTE_EYE_MOVE_INNER_CORNER_HORIZONTALLY (pos, name) { return pos }
  async COMPUTE_EYE_MOVE_OUTER_CORNER_VERTICALLY (pos, name) { return pos }
  async COMPUTE_EYE_MOVE_INNER_CORNER_VERTICALLY (pos, name) { return pos }
  async COMPUTE_EYE_MOVE_HORIZONTALLY (pos, name) { return pos }
  async COMPUTE_EYE_MOVE_VERTICALLY (pos, name) { return pos }
  async COMPUTE_EYE_SCALE (pos, name) { return pos }

  async COMPUTE_NOSE_MOVE_VERTICALLY (pos, name) { return pos }
  async COMPUTE_NOSE_MOVE_HORIZONTALLY (pos, name) { return pos }
  async COMPUTE_NOSE_MOVE_DEPTH (pos, name) { return pos }
  async COMPUTE_NOSE_SCALE_VERTICALLY (pos, name) { return pos }
  async COMPUTE_NOSE_SCALE_HORIZONTALLY (pos, name) { return pos }
  async COMPUTE_NOSE_SCALE_DEPTH (pos, name) { return pos }
  async COMPUTE_NOSE_SCALE_NOSTRILS_WIDTH (pos, name) { return pos }
  async COMPUTE_NOSE_TIP_WIDTH (pos, name) { return pos }
  async COMPUTE_NOSE_MOVE_BASE_VERTICALLY (pos, name) { return pos }
  async COMPUTE_NOSE_SCALE_WIDTH_0 (pos, name) { return pos }
  async COMPUTE_NOSE_SCALE_WIDTH_1 (pos, name) { return pos }
  async COMPUTE_NOSE_SCALE_WIDTH_2 (pos, name) { return pos }
  async COMPUTE_NOSE_COMPRESSION (pos, name) { return pos }
  async COMPUTE_NOSE_CURVE (pos, name) { return pos }
  async COMPUTE_NOSE_GREEK (pos, name) { return pos }
  async COMPUTE_NOSE_HUMP (pos, name) { return pos }
  async COMPUTE_NOSE_VOLUME (pos, name) { return pos }
  async COMPUTE_NOSE_NOSTRILS_ANGLE (pos, name) { return pos }
  async COMPUTE_NOSE_MOVE_TIP_VERTICALLY (pos, name) { return pos }
  async COMPUTE_NOSE_SEPTUM_ANGLE (pos, name) { return pos }
  async COMPUTE_NOSE_SCALE_NOSTRILS_FLARING (pos, name) { return pos }

  async COMPUTE_MOUSE_SCALE_VERTICALLY (pos, name) { return pos }
  async COMPUTE_MOUSE_SCALE_HORIZONTALLY (pos, name) { return pos }
  async COMPUTE_MOUSE_SCALE_DEPTH (pos, name) { return pos }
  async COMPUTE_MOUSE_MOVE_VERTICALLY (pos, name) { return pos }
  async COMPUTE_MOUSE_MOVE_HORIZONTALLY (pos, name) { return pos }
  async COMPUTE_MOUSE_MOVE_DEPTH (pos, name) { return pos }
  async COMPUTE_MOUSE_SCALE_LOWERLIP_HEIGHT (pos, name) { return pos }
  async COMPUTE_MOUSE_SCALE_LOWERLIP_WIDTH (pos, name) { return pos }
  async COMPUTE_MOUSE_SCALE_UPPERLIP_HEIGHT (pos, name) { return pos }
  async COMPUTE_MOUSE_SCALE_UPPERLIP_WIDTH (pos, name) { return pos }
  async COMPUTE_MOUSE_CUPIDS_BOW_WIDTH (pos, name) { return pos }
  async COMPUTE_MOUSE_DIMPLES (pos, name) { return pos }
  async COMPUTE_MOUSE_LAUGH_LINES (pos, name) { return pos }
}

export default CatMaker
