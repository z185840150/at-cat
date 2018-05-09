import * as BABYLON from 'babylonjs' // eslint-disable-line
import { Game, CatMesh, CatGene } from './index' // eslint-disable-line
/**
 * 猫生成器
 *
 * @export
 * @class CatMaker
 */
export default class CatMaker {
  /**
   * 游戏
   *
   * @type {Game}
   * @memberof CatMaker
   */
  get game () { return this._game }
  set game (val) { this._game = val }
  /**
   * 全部目标数据
   *
   * @type {Map<string, Map<number, BABYLON.Vector3>>}
   * @memberof CatMaker
   */
  get targets () { return this._targets }
  set targets (val) { this._targets = val }
  /**
   * 基本模型Position数据
   *
   * @type {Number[]}
   * @memberof CatMaker
   */
  get basePosition () { return this._basePosition }
  set basePosition (val) { this._basePosition = val }

  /**
   * 构造函数
   *
   * @param {Game} game 游戏
   * @memberof CatMaker
   */
  constructor (game) {
    this._game = game
    this._targets = new Map()
  }

  /**
   * 加载目标资源文件
   *
   * @param {function} callback
   * @memberof CatMaker
   */
  loadTargets (callback) {
    // this._targets && this._targets.clear()
    // this._targets = new Map()
    this._targets = {}

    const [{assetsManager}] = [this.game]

    assetsManager.reset() // 资源管理器初始化

    let task = assetsManager.addTextFileTask('target-file-load-task', `./static/assets/resources/cat/target/cat-target.target`)
    let taskBase = assetsManager.addTextFileTask('target-base-file-load-task', `./static/assets/resources/cat/target/cat.target`)
    taskBase.onSuccess = ({text: t}) => {
      let _t = t.split('|')
      this.basePosition = []
      _t.map((v, i) => {
        this.basePosition.push(Number(v))
      })
      console.log(this.basePosition)
    }
    task.onSuccess = ({text: t}) => {
      /** 段落数组 */
      let sections = t.split('\n*')

      for (let i = 0; i < sections.length; i++) {
        let lines = sections[i].split('\n')
        let name = lines[0].replace('*', '').trim()

        // let target = new Map()
        let target = {}
        lines.map((line, i) => {
          if (i > 0) { // 段落第一行为Target名称
            let vals = line.split(' ')
            // target.set(Number(vals[0]), new BABYLON.Vector3(Number(vals[1]), Number(vals[2]), Number(vals[3])))
            target[vals[0]] = new BABYLON.Vector3(Number(vals[1]), Number(vals[2]), Number(vals[3]))
          }
        })
        this.targets[name] = target
        // this.targets.set(name, target)
      }
      callback && callback(this) // eslint-disable-line
    }

    assetsManager.load() // 资源管理器启动加载任务
  }

  /**
   * 范围化数字
   *
   * @param {any} v
   * @param {any} min
   * @param {any} max
   * @returns {number}
   * @memberof CatMaker
   */
  clamp (v, min, max) {
    return v > max ? max : v < min ? min : v
  }

  /**
   * 重建一只猫
   *
   * @param {CatMesh} cat 猫
   * @memberof CatMaker
   */
  async build (cat) {
    console.log(1, cat)
    // const mesh = cat.meshes.get('body')

    // mesh.visibility = 0
    for (let hash of Object.keys(cat.genes)) {
      // console.log(cat.basePosition)
      let gene = cat.genes[hash]
      cat.basePosition = [].concat(this.basePosition)
      let pos = [].concat(cat.basePosition)
      await this.COMPUTE_AGE(pos, gene, cat.basePosition)
        // .then(pos => this.COMPUTE_SEX(pos, gene, cat.basePosition))
        .then(pos => this.COMPUTE_WEIGHT(pos, gene, cat.basePosition))
        // .then(pos => this.COMPUTE_FATRATE(pos, gene, cat.basePosition))
        .then(pos => this.COMPUTE_HEAD_AGE(pos, gene, cat.basePosition))
        .then(pos => this.COMPUTE_HEAD_FAT(pos, gene, cat.basePosition))
        .then(pos => this.COMPUTE_HEAD_ANGLE(pos, gene, cat.basePosition))

        // .then(pos => this.COMPUTE_HEAD_OVAL(pos, gene, cat.basePosition))
        // .then(pos => this.COMPUTE_HEAD_ROUND(pos, gene, cat.basePosition))
        // .then(pos => this.COMPUTE_HEAD_RECTANGULAR(pos, gene, cat.basePosition))
        // .then(pos => this.COMPUTE_HEAD_SQUARE(pos, gene, cat.basePosition))

        .then(pos => this.COMPUTE_HEAD_PARIETAL_SCALE_DEPTH(pos, gene, cat.basePosition))

        .then(pos => {
          console.log('build success')
          console.log(cat)
          // cat.mesh['body'].setVerticesData(BABYLON.VertexBuffer.PositionKind, pos)
          // cat.mesh['body'].visibility = 1
          console.log(cat.meshs)
          console.log(cat.meshs.body)
          cat.postions[hash] = pos
        })
    }
  }

  /** 计算模型Promise返回项
   * @typedef {Number[]} computePromiseObject
   */
  /** 计算年龄
   * @param {number[]} pos
   * @param {CatGene} gene
   * @param {number[]} base 标准模型点
   */
  async COMPUTE_AGE (pos, gene, base) {
    const value = this.clamp(gene.age, 0, 1)
    const lerp = value < 0.5 ? 1 - 2 * value : 2 * value - 1

    const target = this.targets[value < 0.5 ? 'body_age_min' : 'body_age_max']
    for (let i of Object.keys(target)) {
      // console.log(pos[i * 3 + 0], target[i][0], base[i * 3 + 0], lerp)
      pos[i * 3 + 0] += (target[i].x - base[i * 3 + 0]) * lerp
      pos[i * 3 + 1] += (target[i].y - base[i * 3 + 1]) * lerp
      pos[i * 3 + 2] += (target[i].z - base[i * 3 + 2]) * lerp
    }

    return base
  }
  /** 计算性别
   * @param {*} pos
   * @param {*} name
   */
  async COMPUTE_SEX (pos, gene, base) {
    const value = this.clamp(gene.sex, 0, 1)
    const lerp = value < 0.5 ? 1 - 2 * value : 2 * value - 1

    const target = this.targets[value < 0.5 ? 'body_sex_min' : 'body_sex_max']
    for (let i of Object.keys(target)) {
      pos[i * 3 + 0] += (target[i].x - base[i * 3 + 0]) * lerp
      pos[i * 3 + 1] += (target[i].y - base[i * 3 + 1]) * lerp
      pos[i * 3 + 2] += (target[i].z - base[i * 3 + 2]) * lerp
    }

    return pos
  }
  /** 计算体脂率
   * @param {number[]} pos
   * @param {string} name
   * @returns {Promise.<computePromiseObject, Error>} Promise
   * @memberof CatMaker
   */
  async COMPUTE_FATRATE (pos, gene, base) {
    const value = this.clamp(gene.fatRate, 0, 1)
    const lerp = value < 0.5 ? 1 - 2 * value : 2 * value - 1
    console.log('体脂率程度:', gene.fatRate)
    const target = this.targets[value < 0.5 ? 'body_fatRate_min' : 'body_fatRate_max']
    for (let i of Object.keys(target)) {
      pos[i * 3 + 0] += (target[i].x - base[i * 3 + 0]) * lerp
      pos[i * 3 + 1] += (target[i].y - base[i * 3 + 1]) * lerp
      pos[i * 3 + 2] += (target[i].z - base[i * 3 + 2]) * lerp
    }

    return pos
  }
  /** 计算肥胖度
   * @param {*} pos
   * @param {*} name
   */
  async COMPUTE_WEIGHT (pos, gene, base) {
    console.log('胖瘦程度:', gene.weight)
    const value = this.clamp(gene.weight, 0, 1)
    const lerp = value < 0.5 ? 1 - 2 * value : 2 * value - 1

    const target = this.targets[value < 0.5 ? 'body_weight_min' : 'body_weight_max']
    for (let i of Object.keys(target)) {
      pos[i * 3 + 0] += (target[i].x - base[i * 3 + 0]) * lerp
      pos[i * 3 + 1] += (target[i].y - base[i * 3 + 1]) * lerp
      pos[i * 3 + 2] += (target[i].z - base[i * 3 + 2]) * lerp
    }

    return pos
  }
  /** 计算肥高度
   * @param {*} pos
   * @param {*} name
   */
  async COMPUTE_HEIGHT (pos, name) { return pos }
  /** 计算肥面部年龄
   * @param {*} pos
   * @param {*} name
   */
  async COMPUTE_HEAD_AGE (pos, gene, base) {
    const value = this.clamp(gene.headAge, 0, 1)
    const lerp = value < 0.5 ? 1 - 2 * value : 2 * value - 1

    const target = this.targets[value < 0.5 ? 'head_age_min' : 'head_age_max']
    for (let i of Object.keys(target)) {
      pos[i * 3 + 0] += (target[i].x - base[i * 3 + 0]) * lerp
      pos[i * 3 + 1] += (target[i].y - base[i * 3 + 1]) * lerp
      pos[i * 3 + 2] += (target[i].z - base[i * 3 + 2]) * lerp
    }

    return pos
  }
  /** 计算肥面部肥胖度
   * @param {*} pos
   * @param {*} name
   */
  async COMPUTE_HEAD_FAT (pos, gene, base) {
    const value = this.clamp(gene.headFat, 0, 1)
    const lerp = value < 0.5 ? 1 - 2 * value : 2 * value - 1

    const target = this.targets[value < 0.5 ? 'head_fat_min' : 'head_fat_max']
    for (let i of Object.keys(target)) {
      pos[i * 3 + 0] += (target[i].x - base[i * 3 + 0]) * lerp
      pos[i * 3 + 1] += (target[i].y - base[i * 3 + 1]) * lerp
      pos[i * 3 + 2] += (target[i].z - base[i * 3 + 2]) * lerp
    }

    return pos
  }
  /** 计算肥面部角度
   * @param {*} pos
   * @param {*} name
   */
  async COMPUTE_HEAD_ANGLE (pos, gene, base) {
    const value = this.clamp(gene.headAngle, 0, 1)
    const lerp = value < 0.5 ? 1 - 2 * value : 2 * value - 1

    const target = this.targets[value < 0.5 ? 'head_angle_min' : 'head_angle_max']
    for (let i of Object.keys(target)) {
      pos[i * 3 + 0] += (target[i].x - base[i * 3 + 0]) * lerp
      pos[i * 3 + 1] += (target[i].y - base[i * 3 + 1]) * lerp
      pos[i * 3 + 2] += (target[i].z - base[i * 3 + 2]) * lerp
    }

    return pos
  }
  /** 计算肥面部椭圆形
   * @param {*} pos
   * @param {*} name
   */
  async COMPUTE_HEAD_OVAL (pos, gene, base) {
    const value = this.clamp(gene.headOval - 0.5, 0, 1)
    const lerp = value < 0.5 ? 1 - 2 * value : 2 * value - 1

    const target = this.targets['oval']
    for (let i of Object.keys(target)) {
      pos[i * 3 + 0] += (target[i].x - base[i * 3 + 0]) * lerp
      pos[i * 3 + 1] += (target[i].y - base[i * 3 + 1]) * lerp
      pos[i * 3 + 2] += (target[i].z - base[i * 3 + 2]) * lerp
    }

    return pos
  }
  /** 计算肥面部圆形
   * @param {*} pos
   * @param {*} name
   */
  async COMPUTE_HEAD_ROUND (pos, gene, base) {
    const value = this.clamp(gene.headRound - 0.5, 0, 1)
    const lerp = value < 0.5 ? 1 - 2 * value : 2 * value - 1

    const target = this.targets['head_round']
    for (let i of Object.keys(target)) {
      pos[i * 3 + 0] += (target[i].x - base[i * 3 + 0]) * lerp
      pos[i * 3 + 1] += (target[i].y - base[i * 3 + 1]) * lerp
      pos[i * 3 + 2] += (target[i].z - base[i * 3 + 2]) * lerp
    }

    return pos
  }
  /** 计算肥面部矩形
   * @param {*} pos
   * @param {*} name
   */
  async COMPUTE_HEAD_RECTANGULAR (pos, gene, base) {
    const value = this.clamp(gene.headRectangular - 0.5, 0, 1)
    const lerp = value < 0.5 ? 1 - 2 * value : 2 * value - 1

    const target = this.targets['head_rectangular']
    for (let i of Object.keys(target)) {
      pos[i * 3 + 0] += (target[i].x - base[i * 3 + 0]) * lerp
      pos[i * 3 + 1] += (target[i].y - base[i * 3 + 1]) * lerp
      pos[i * 3 + 2] += (target[i].z - base[i * 3 + 2]) * lerp
    }

    return pos
  }
  /** 计算肥面部正方形
   * @param {*} pos
   * @param {*} name
   */
  async COMPUTE_HEAD_SQUARE (pos, gene, base) {
    const value = this.clamp(gene.headSquare - 0.5, 0, 1)
    const lerp = value < 0.5 ? 1 - 2 * value : 2 * value - 1

    const target = this.targets['head_square']
    for (let i of Object.keys(target)) {
      pos[i * 3 + 0] += (target[i].x - base[i * 3 + 0]) * lerp
      pos[i * 3 + 1] += (target[i].y - base[i * 3 + 1]) * lerp
      pos[i * 3 + 2] += (target[i].z - base[i * 3 + 2]) * lerp
    }

    return pos
  }
  /** 计算肥面部三角形
   *
   * @param {any} pos
   * @param {any} name
   * @returns
   * @memberof CatMaker
   */
  async COMPUTE_HEAD_TRIANGULAR (pos, gene, base) { return pos }
  /** 计算肥面部倒三角形
   * @param {*} pos
   * @param {*} name
   */
  async COMPUTE_HEAD_TRIANGULAR_INVERTED (pos, gene, base) { return pos }
  /** 计算肥面部菱形
   * @param {*} pos
   * @param {*} name
   */
  async COMPUTE_HEAD_DIAMOND (pos, gene, base) { return pos }
  /** 计算头顶缩放深度
   * @param {*} pos
   * @param {*} name
   */
  async COMPUTE_HEAD_PARIETAL_SCALE_DEPTH (pos, gene, base) {
    const value = this.clamp(gene.headParietalScaleDepth, 0, 1)
    const lerp = value < 0.5 ? 1 - 2 * value : 2 * value - 1

    const target = this.targets[value < 0.5 ? 'head_parietal_scale_depth_min' : 'head_parietal_scale_depth_max']
    for (let i of Object.keys(target)) {
      pos[i * 3 + 0] += (target[i].x - base[i * 3 + 0]) * lerp
      pos[i * 3 + 1] += (target[i].y - base[i * 3 + 1]) * lerp
      pos[i * 3 + 2] += (target[i].z - base[i * 3 + 2]) * lerp
    }

    return pos
  }
  /** 计算头部缩放深度
   * @param {*} pos
   * @param {*} name
   */
  async COMPUTE_HEAD_SCALE_DEPTH (pos, gene, base) { return pos }
  /** 计算头部水平缩放
   * @param {*} pos
   * @param {*} name
   */
  async COMPUTE_HEAD_SCALE_HORIZONTALLY (pos, gene, base) { return pos }
  /** 计算头部垂直缩放
   * @param {*} pos
   * @param {*} name
   */
  async COMPUTE_HEAD_SCALE_VERTICALLY (pos, gene, base) { return pos }
  /** 计算头部深度位移
   * @param {*} pos
   * @param {*} name
   */
  async COMPUTE_HEAD_MOVE_DEPTH (pos, gene, base) { return pos }
  /** 计算头部水平位移
   * @param {*} pos
   * @param {*} name
   */
  async COMPUTE_HEAD_MOVE_HORIZONTALLY (pos, gene, base) { return pos }
  /** 计算头部垂直位移
   * @param {*} pos
   * @param {*} name
   */
  async COMPUTE_HEAD_MOVE_VERTICALLY (pos, gene, base) { return pos }
  /** 计算额头凸起
   * @param {*} pos
   * @param {*} name
   */
  async COMPUTE_FOREHEAD_BULGE (pos, gene, base) { return pos }
  /** 计算额头垂直缩放
   * @param {*} pos
   * @param {*} name
   */
  async COMPUTE_FOREHEAD_SCALE_VERTICALLY (pos, gene, base) { return pos }
  /** 计算额头颅骨凸起
   * @param {*} pos
   * @param {*} name
   */
  async COMPUTE_FOREHEAD_CRANIC_SHAPE (pos, gene, base) { return pos }
  /** 计算额头太阳穴凸起
   * @param {*} pos
   * @param {*} name
   */
  async COMPUTE_FOREHEAD_TEMPLE_BULGE (pos, gene, base) { return pos }
  /** 计算眉骨凸起
   * @param {*} pos
   * @param {*} name
   */
  async COMPUTE_EYEBROWS_BULGE (pos, gene, base) { return pos }
  /** 计算眉骨角度
   * @param {*} pos
   * @param {*} name
   */
  async COMPUTE_EYEBROWS_ANGLE (pos, gene, base) { return pos }
  /** 计算眉骨垂直位移
   * @param {*} pos
   * @param {*} name
   */
  async COMPUTE_EYEBROWS_MOVE_VERTICALLY (pos, gene, base) { return pos }

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
