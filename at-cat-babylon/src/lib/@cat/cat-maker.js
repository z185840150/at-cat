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
   * @type {Object.<string, Object.<number, BABYLON.Vector3>>}
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
   * 全部贴图
   *
   * @type {Object.<string, BABYLON.Texture>}
   * @memberof CatMaker
   */
  get textures () { return this._textures }
  set textures (val) { this._textures = val }

  /**
   * 构造函数
   *
   * @param {Game} game 游戏
   * @memberof CatMaker
   */
  constructor (game) {
    this._game = game
    this._targets = {}
    this._basePosition = []
    this._textures = {}
  }
  /**
   * 加载目标资源文件
   *
   * @param {function} callback
   * @memberof CatMaker
   */
  loadTargets (callback) {
    // 加载所有贴图
    this.textures.env = BABYLON.CubeTexture.CreateFromPrefilteredData('./static/assets/resources/hdri/skybox_2.dds', this.game.scene)

    this.textures.eyeBaseColorLeft = new BABYLON.Texture('./static/assets/resources/cat/textures/eye/m_cat_eye_left_pbr_mr_baseColor.png')
    this.textures.eyeNormalLeft = new BABYLON.Texture('./static/assets/resources/cat/textures/eye/m_cat_eye_left_pbr_mr_normal.png')
    this.textures.eyeOcclusionRoughnessMetallicLeft = new BABYLON.Texture('./static/assets/resources/cat/textures/eye/m_cat_eye_left_pbr_mr_occlusionRoughnessMetallic.png')
    this.textures.eyeBaseColorRight = new BABYLON.Texture('./static/assets/resources/cat/textures/eye/m_cat_eye_right_pbr_mr_baseColor.png')
    this.textures.eyeNormalRight = new BABYLON.Texture('./static/assets/resources/cat/textures/eye/m_cat_eye_right_pbr_mr_normal.png')
    this.textures.eyeOcclusionRoughnessMetallicRight = new BABYLON.Texture('./static/assets/resources/cat/textures/eye/m_cat_eye_right_pbr_mr_occlusionRoughnessMetallic.png')
    this.textures.eyeBaseColorGlass = new BABYLON.Texture('./static/assets/resources/cat/textures/eye/m_cat_eye_glass_pbr_mr_baseColor.png')
    this.textures.eyeNormalGlass = new BABYLON.Texture('./static/assets/resources/cat/textures/eye/m_cat_eye_glass_pbr_mr_baseColor.png')
    this.textures.eyeOcclusionRoughnessMetallicGlass = new BABYLON.Texture('./static/assets/resources/cat/textures/eye/m_cat_eye_glass_pbr_mr_baseColor.png')

    this.textures.siameseBaseColor = new BABYLON.Texture('./static/assets/resources/cat/textures/siamese/m_cat_body_pbr_mr_baseColor.png')
    this.textures.siameseNormalColor = new BABYLON.Texture('./static/assets/resources/cat/textures/siamese/m_cat_body_pbr_mr_normal.png')
    this.textures.siameseOcclusionRoughnessMetallic = new BABYLON.Texture('./static/assets/resources/cat/textures/siamese/m_cat_body_pbr_mr_occlusionRoughnessMetallic.png')

    this.textures.ragdollBaseColor = new BABYLON.Texture('./static/assets/resources/cat/textures/ragdoll/m_cat_body_pbr_mr_baseColor.png')
    this.textures.ragdollNormalColor = new BABYLON.Texture('./static/assets/resources/cat/textures/ragdoll/m_cat_body_pbr_mr_normal.png')
    this.textures.ragdollOcclusionRoughnessMetallic = new BABYLON.Texture('./static/assets/resources/cat/textures/ragdoll/m_cat_body_pbr_mr_occlusionRoughnessMetallic.png')

    this.textures.persianBaseColor = new BABYLON.Texture('./static/assets/resources/cat/textures/persian/m_cat_body_pbr_mr_baseColor.png')
    this.textures.persianNormalColor = new BABYLON.Texture('./static/assets/resources/cat/textures/persian/m_cat_body_pbr_mr_normal.png')
    this.textures.persianOcclusionRoughnessMetallic = new BABYLON.Texture('./static/assets/resources/cat/textures/persian/m_cat_body_pbr_mr_occlusionRoughnessMetallic.png')

    this.game.assetsManager.reset() // 资源管理器初始化

    let taskBaseTarget = this.game.assetsManager.addTextFileTask('target-base-file-load-task', `./static/assets/resources/cat/target/cat.target`)
    let taskTargets = this.game.assetsManager.addTextFileTask('target-file-load-task', `./static/assets/resources/cat/target/cat-target.target`)

    let _taskBaseSuccess = false
    let _taskTargetsSuccess = false

    taskBaseTarget.onSuccess = ({text: str}) => {
      const arr = str.split('|') // 点字符串数组
      for (let i = 0; i < arr.length; i++) this.basePosition.push(Number(arr[i]))
      _taskBaseSuccess = true
      _taskTargetsSuccess && callback && callback()
    }
    taskTargets.onSuccess = ({text: str}) => {
      const sections = str.split('\n*') // 段落数组

      for (let i = 0; i < sections.length; i++) {
        let lines = sections[i].split('\n')
        let name = lines[0].replace('*', '').trim()

        let target = {}
        for (let i = 1; i < lines.length; i++) {
          let arr = lines[i].split(' ')
          target[arr[0]] = new BABYLON.Vector3(Number(arr[1]), Number(arr[2]), Number(arr[3]))
        }
        this.targets[name] = target
        _taskTargetsSuccess = true
        _taskBaseSuccess && callback && callback()
      }
    }
    // 资源管理器启动加载任务
    this.game.assetsManager.load()
  }
  /**
   * 同步加载目标资源文件
   *
   * @param {function} callback
   * @memberof CatMaker
   */
  loadTargetsAsync () {
    return new Promise((resolve, reject) => {
      this.loadTargets(function () { resolve() })
    })
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
    for (let hash of Object.keys(cat.genes)) {
      let gene = cat.genes[hash]
      let pos = [].concat(cat.basePosition)

      await this.COMPUTE_AGE(pos, gene, cat.basePosition)
        .then(pos => this.COMPUTE_SEX(pos, gene, cat.basePosition))
        .then(pos => this.COMPUTE_WEIGHT(pos, gene, cat.basePosition))
        .then(pos => this.COMPUTE_HEIGHT(pos, gene, cat.basePosition))
        .then(pos => this.COMPUTE_FATRATE(pos, gene, cat.basePosition))

        .then(pos => this.COMPUTE_HEAD_AGE(pos, gene, cat.basePosition))
        .then(pos => this.COMPUTE_HEAD_FAT(pos, gene, cat.basePosition))
        .then(pos => this.COMPUTE_HEAD_ANGLE(pos, gene, cat.basePosition))

        .then(pos => this.COMPUTE_HEAD_OVAL(pos, gene, cat.basePosition, 0.2))
        .then(pos => this.COMPUTE_HEAD_ROUND(pos, gene, cat.basePosition, 0.2))
        .then(pos => this.COMPUTE_HEAD_RECTANGULAR(pos, gene, cat.basePosition, 0.6))
        .then(pos => this.COMPUTE_HEAD_SQUARE(pos, gene, cat.basePosition, 0.2))
        .then(pos => this.COMPUTE_HEAD_TRIANGULAR(pos, gene, cat.basePosition, 0.6))
        .then(pos => this.COMPUTE_HEAD_TRIANGULAR_INVERTED(pos, gene, cat.basePosition, 0.6))
        .then(pos => this.COMPUTE_HEAD_DIAMOND(pos, gene, cat.basePosition, 0.2))
        .then(pos => this.COMPUTE_HEAD_PARIETAL_SCALE_DEPTH(pos, gene, cat.basePosition, 0.2))
        .then(pos => this.COMPUTE_HEAD_SCALE_DEPTH(pos, gene, cat.basePosition, 0.6))
        .then(pos => this.COMPUTE_HEAD_SCALE_HORIZONTALLY(pos, gene, cat.basePosition, 0.6))
        .then(pos => this.COMPUTE_HEAD_SCALE_VERTICALLY(pos, gene, cat.basePosition, 0.6))
        .then(pos => this.COMPUTE_HEAD_MOVE_DEPTH(pos, gene, cat.basePosition, 0.2))
        .then(pos => this.COMPUTE_HEAD_MOVE_HORIZONTALLY(pos, gene, cat.basePosition, 0.2))
        .then(pos => this.COMPUTE_HEAD_MOVE_VERTICALLY(pos, gene, cat.basePosition, 0.2))

        .then(pos => this.COMPUTE_FOREHEAD_BULGE(pos, gene, cat.basePosition))
        .then(pos => this.COMPUTE_FOREHEAD_SCALE_VERTICALLY(pos, gene, cat.basePosition))
        .then(pos => this.COMPUTE_FOREHEAD_CRANIC_SHAPE(pos, gene, cat.basePosition))
        .then(pos => this.COMPUTE_FOREHEAD_TEMPLE_BULGE(pos, gene, cat.basePosition))

        .then(pos => this.COMPUTE_EYEBROWS_BULGE(pos, gene, cat.basePosition))
        .then(pos => this.COMPUTE_EYEBROWS_ANGLE(pos, gene, cat.basePosition))
        .then(pos => this.COMPUTE_EYEBROWS_MOVE_VERTICALLY(pos, gene, cat.basePosition))

        .then(pos => this.COMPUTE_NECK_DOUBLE(pos, gene, cat.basePosition))
        .then(pos => this.COMPUTE_NECK_SCALE_DEPTH(pos, gene, cat.basePosition))
        .then(pos => this.COMPUTE_NECK_SCALE_DEPTH_OF_NAPE(pos, gene, cat.basePosition))
        .then(pos => this.COMPUTE_NECK_SCALE_HORIZONTALLY(pos, gene, cat.basePosition))
        .then(pos => this.COMPUTE_NECK_SCALE_VERTICALLY(pos, gene, cat.basePosition))
        .then(pos => this.COMPUTE_NECK_MOVE_DEPTH(pos, gene, cat.basePosition))
        .then(pos => this.COMPUTE_NECK_MOVE_HORIZONTALLY(pos, gene, cat.basePosition))
        .then(pos => this.COMPUTE_NECK_MOVE_VERTICALLY(pos, gene, cat.basePosition))

        .then(pos => this.COMPUTE_EYE_BAG_VOLUME(pos, gene, cat.basePosition))
        .then(pos => this.COMPUTE_EYE_BAG_DISTORSION(pos, gene, cat.basePosition))
        .then(pos => this.COMPUTE_EYE_BAG_HEIGHT(pos, gene, cat.basePosition))
        .then(pos => this.COMPUTE_EYE_FOLD_ANGLE(pos, gene, cat.basePosition))
        .then(pos => this.COMPUTE_EYE_FOLD_VOLUME(pos, gene, cat.basePosition))
        .then(pos => this.COMPUTE_EYE_EPICANTHUS(pos, gene, cat.basePosition))
        .then(pos => this.COMPUTE_EYE_SCALEHEIGHT_0(pos, gene, cat.basePosition))
        .then(pos => this.COMPUTE_EYE_SCALEHEIGHT_1(pos, gene, cat.basePosition))
        .then(pos => this.COMPUTE_EYE_SCALEHEIGHT_2(pos, gene, cat.basePosition))
        .then(pos => this.COMPUTE_EYE_SCALEHEIGHT_3(pos, gene, cat.basePosition))
        .then(pos => this.COMPUTE_EYE_SCALEHEIGHT_4(pos, gene, cat.basePosition))
        .then(pos => this.COMPUTE_EYE_MOVE_OUTER_CORNER_HORIZONTALLY(pos, gene, cat.basePosition))
        .then(pos => this.COMPUTE_EYE_MOVE_INNER_CORNER_HORIZONTALLY(pos, gene, cat.basePosition))
        .then(pos => this.COMPUTE_EYE_MOVE_OUTER_CORNER_VERTICALLY(pos, gene, cat.basePosition))
        .then(pos => this.COMPUTE_EYE_MOVE_INNER_CORNER_VERTICALLY(pos, gene, cat.basePosition))
        .then(pos => this.COMPUTE_EYE_MOVE_HORIZONTALLY(pos, gene, cat.basePosition))
        .then(pos => this.COMPUTE_EYE_MOVE_VERTICALLY(pos, gene, cat.basePosition))
        .then(pos => this.COMPUTE_EYE_SCALE(pos, gene, cat.basePosition))

        .then(pos => {
          cat.positions[hash] = pos
        })
        .then(() => this.COMPUTE_EYE_COLOR(gene, cat))
        .then(() => this.COMPUTE_BREEDS(gene, cat))
    }
  }
  /** 计算模型Promise返回项
   * @typedef {Number[]} computePromiseObject
   */
  /**
   *
   *
   * @param {CatGene} gene
   * @param {CatMesh} cat
   * @memberof CatMaker
   */
  async COMPUTE_EYE_COLOR (gene, cat) {
    cat.mats['m_cat_eye_glass_pbr_mr'].metallic = 1
    cat.mats['m_cat_eye_glass_pbr_mr'].roughness = 0
    cat.mats['m_cat_eye_glass_pbr_mr'].albedoColor = new BABYLON.Color3(0, 0, 0)
    cat.mats['m_cat_eye_glass_pbr_mr'].albedoTexture = this.textures.eyeBaseColorGlass
    cat.mats['m_cat_eye_glass_pbr_mr'].albedoTexture.hasAlpha = true
    // cat.mats['m_cat_eye_glass_pbr_mr'].bumpTexture = this.textures.eyeNormalGlass
    cat.mats['m_cat_eye_glass_pbr_mr'].metallicTexture = this.textures.eyeOcclusionRoughnessMetallicGlass
    cat.mats['m_cat_eye_glass_pbr_mr'].useRoughnessFromMetallicTextureAlpha = false
    cat.mats['m_cat_eye_glass_pbr_mr'].useRoughnessFromMetallicTextureGreen = true
    cat.mats['m_cat_eye_glass_pbr_mr'].useMetallnessFromMetallicTextureBlue = true
    // cat.mats['m_cat_eye_glass_pbr_mr'].useParallax = true
    // cat.mats['m_cat_eye_glass_pbr_mr'].useParallaxOcclusion = true
    // cat.mats['m_cat_eye_glass_pbr_mr'].parallaxScaleBias = 0.1
    cat.mats['m_cat_eye_glass_pbr_mr'].useAlphaFromAlbedoTexture = true
    cat.mats['m_cat_eye_glass_pbr_mr'].useRadianceOverAlpha = true
    cat.mats['m_cat_eye_glass_pbr_mr'].environmentTexture = this.textures.env
    // 折射
    // cat.mats['m_cat_eye_glass_pbr_mr'].linkRefractionWithTransparency = true
    // cat.mats['m_cat_eye_glass_pbr_mr'].indexOfRefraction = 0.52

    cat.mats['m_cat_eye_left_pbr_mr'].metallic = 1
    cat.mats['m_cat_eye_left_pbr_mr'].roughness = 1
    cat.mats['m_cat_eye_left_pbr_mr'].albedoColor = gene.eyeColorLeft
    cat.mats['m_cat_eye_left_pbr_mr'].albedoTexture = this.textures.eyeBaseColorLeft
    cat.mats['m_cat_eye_left_pbr_mr'].bumpTexture = this.textures.eyeNormalLeft
    cat.mats['m_cat_eye_left_pbr_mr'].metallicTexture = this.textures.eyeOcclusionRoughnessMetallicLeft
    cat.mats['m_cat_eye_left_pbr_mr'].useRoughnessFromMetallicTextureAlpha = false
    cat.mats['m_cat_eye_left_pbr_mr'].useRoughnessFromMetallicTextureGreen = true
    cat.mats['m_cat_eye_left_pbr_mr'].useMetallnessFromMetallicTextureBlue = true
    // cat.mats['m_cat_eye_left_pbr_mr'].useParallax = true
    // cat.mats['m_cat_eye_left_pbr_mr'].useParallaxOcclusion = true
    // cat.mats['m_cat_eye_left_pbr_mr'].parallaxScaleBias = 0.1
    cat.mats['m_cat_eye_left_pbr_mr'].environmentTexture = this.textures.env

    cat.mats['m_cat_eye_right_pbr_mr'].metallic = 1
    cat.mats['m_cat_eye_right_pbr_mr'].roughness = 1
    cat.mats['m_cat_eye_right_pbr_mr'].albedoColor = gene.eyeColorRight
    cat.mats['m_cat_eye_right_pbr_mr'].albedoTexture = this.textures.eyeBaseColorRight
    cat.mats['m_cat_eye_right_pbr_mr'].bumpTexture = this.textures.eyeNormalRight
    cat.mats['m_cat_eye_right_pbr_mr'].metallicTexture = this.textures.eyeOcclusionRoughnessMetallicRight
    cat.mats['m_cat_eye_right_pbr_mr'].useRoughnessFromMetallicTextureAlpha = false
    cat.mats['m_cat_eye_right_pbr_mr'].useRoughnessFromMetallicTextureGreen = true
    cat.mats['m_cat_eye_right_pbr_mr'].useMetallnessFromMetallicTextureBlue = true
    // cat.mats['m_cat_eye_right_pbr_mr'].useParallax = true
    // cat.mats['m_cat_eye_right_pbr_mr'].useParallaxOcclusion = true
    // cat.mats['m_cat_eye_right_pbr_mr'].parallaxScaleBias = 0.1
    cat.mats['m_cat_eye_right_pbr_mr'].environmentTexture = this.textures.env
  }
  /**
   * 计算种族
   *
   * @param {CatGene} gene
   * @param {CatMesh} cat
   * @memberof CatMaker
   */
  async COMPUTE_BREEDS (gene, cat) {
    console.log(gene.breeds)
    let names = ['americanShorthair', 'bombay', 'britishShorthair', 'canadianHairless', 'egyptianMau', 'exotic', 'maineCoon', 'norwegianForest', 'persian', 'ragdoll', 'russianBlue', 'scottishFold', 'siamese']
    let breed = 'americanShorthair'
    for (let i = 1; i < names.length; i++) {
      breed = gene.breeds[breed] >= gene.breeds[names[i]] ? breed : names[i]
    }
    if (!['ragdoll', 'persian', 'siamese'].includes(breed)) breed = 'siamese'

    cat.mats['m_cat_body_pbr_mr'].metallic = 1
    cat.mats['m_cat_body_pbr_mr'].roughness = 1
    cat.mats['m_cat_body_pbr_mr'].albedoColor = new BABYLON.Color3(1, 1, 1)
    cat.mats['m_cat_body_pbr_mr'].albedoTexture = this.textures[`${breed}BaseColor`]
    cat.mats['m_cat_body_pbr_mr'].bumpTexture = this.textures[`${breed}NormalColor`]
    cat.mats['m_cat_body_pbr_mr'].metallicTexture = this.textures[`${breed}OcclusionRoughnessMetallic`]
    cat.mats['m_cat_body_pbr_mr'].useAmbientOcclusionFromMetallicTextureRed = true
    cat.mats['m_cat_body_pbr_mr'].useRoughnessFromMetallicTextureAlpha = false
    cat.mats['m_cat_body_pbr_mr'].useRoughnessFromMetallicTextureGreen = true
    cat.mats['m_cat_body_pbr_mr'].useMetallnessFromMetallicTextureBlue = true
    // cat.mats['m_cat_body_pbr_mr'].useParallax = true
    // cat.mats['m_cat_body_pbr_mr'].useParallaxOcclusion = true
    // cat.mats['m_cat_body_pbr_mr'].parallaxScaleBias = 0.1
  }

  /** 计算年龄
   *
   * @param {number[]} pos 网格点
   * @param {CatGene} gene 基因
   * @param {number[]} base 标准网格点
   * @param {number} [multiple = 1] 倍数
   * @returns {Promise.<computePromiseObject, Error>} Promise
   * @memberof CatMaker
   */
  async COMPUTE_AGE (pos, gene, base, multiple = 1) {
    const value = this.clamp(gene.age, 0, 1)
    const lerp = value < 0.5 ? 1 - 2 * value : 2 * value - 1

    const target = this.targets[value < 0.5 ? 'body_age_min' : 'body_age_max']
    for (let i of Object.keys(target)) {
      pos[i * 3 + 0] += (target[i].x - base[i * 3 + 0]) * lerp * multiple
      pos[i * 3 + 1] += (target[i].y - base[i * 3 + 1]) * lerp * multiple
      pos[i * 3 + 2] += (target[i].z - base[i * 3 + 2]) * lerp * multiple
    }

    return base
  }
  /** 计算性别
   *
   * @param {number[]} pos 网格点
   * @param {CatGene} gene 基因
   * @param {number[]} base 标准网格点
   * @param {number} [multiple = 1] 倍数
   * @returns {Promise.<computePromiseObject, Error>} Promise
   * @memberof CatMaker
   */
  async COMPUTE_SEX (pos, gene, base, multiple = 1) {
    const value = this.clamp(gene.sex, 0, 1)
    const lerp = value < 0.5 ? 1 - 2 * value : 2 * value - 1

    const target = this.targets[value < 0.5 ? 'body_sex_min' : 'body_sex_max']
    for (let i of Object.keys(target)) {
      pos[i * 3 + 0] += (target[i].x - base[i * 3 + 0]) * lerp * multiple
      pos[i * 3 + 1] += (target[i].y - base[i * 3 + 1]) * lerp * multiple
      pos[i * 3 + 2] += (target[i].z - base[i * 3 + 2]) * lerp * multiple
    }

    return pos
  }
  /** 计算体脂率
   *
   * @param {number[]} pos 网格点
   * @param {CatGene} gene 基因
   * @param {number[]} base 标准网格点
   * @param {number} [multiple = 1] 倍数
   * @returns {Promise.<computePromiseObject, Error>} Promise
   * @memberof CatMaker
   */
  async COMPUTE_FATRATE (pos, gene, base, multiple = 1) {
    const value = this.clamp(gene.fatRate, 0, 1)
    const lerp = value < 0.5 ? 1 - 2 * value : 2 * value - 1

    const target = this.targets[value < 0.5 ? 'body_fatRate_max' : 'body_fatRate_min']
    for (let i of Object.keys(target)) {
      pos[i * 3 + 0] += (target[i].x - base[i * 3 + 0]) * lerp * multiple
      pos[i * 3 + 1] += (target[i].y - base[i * 3 + 1]) * lerp * multiple
      pos[i * 3 + 2] += (target[i].z - base[i * 3 + 2]) * lerp * multiple
    }

    return pos
  }
  /** 计算肥胖度
   *
   * @param {number[]} pos 网格点
   * @param {CatGene} gene 基因
   * @param {number[]} base 标准网格点
   * @param {number} [multiple = 1] 倍数
   * @returns {Promise.<computePromiseObject, Error>} Promise
   * @memberof CatMaker
   */
  async COMPUTE_WEIGHT (pos, gene, base, multiple = 1) {
    const value = this.clamp(gene.weight, 0, 1)
    const lerp = value < 0.5 ? 1 - 2 * value : 2 * value - 1

    const target = this.targets[value < 0.5 ? 'body_weight_min' : 'body_weight_max']
    for (let i of Object.keys(target)) {
      pos[i * 3 + 0] += (target[i].x - base[i * 3 + 0]) * lerp * multiple
      pos[i * 3 + 1] += (target[i].y - base[i * 3 + 1]) * lerp * multiple
      pos[i * 3 + 2] += (target[i].z - base[i * 3 + 2]) * lerp * multiple
    }

    return pos
  }
  /** 计算高度
   *
   * @param {number[]} pos 网格点
   * @param {CatGene} gene 基因
   * @param {number[]} base 标准网格点
   * @param {number} [multiple = 1] 倍数
   * @returns {Promise.<computePromiseObject, Error>} Promise
   * @memberof CatMaker
   */
  async COMPUTE_HEIGHT (pos, gene, base, multiple = 1) { return pos }
  /** 计算肥面部年龄
   *
   * @param {number[]} pos 网格点
   * @param {CatGene} gene 基因
   * @param {number[]} base 标准网格点
   * @param {number} [multiple = 1] 倍数
   * @returns {Promise.<computePromiseObject, Error>} Promise
   * @memberof CatMaker
   */
  async COMPUTE_HEAD_AGE (pos, gene, base, multiple = 1) {
    const value = this.clamp(gene.headAge, 0, 1)
    const lerp = value < 0.5 ? 1 - 2 * value : 2 * value - 1

    const target = this.targets[value < 0.5 ? 'head_age_min' : 'head_age_max']
    for (let i of Object.keys(target)) {
      pos[i * 3 + 0] += (target[i].x - base[i * 3 + 0]) * lerp * multiple
      pos[i * 3 + 1] += (target[i].y - base[i * 3 + 1]) * lerp * multiple
      pos[i * 3 + 2] += (target[i].z - base[i * 3 + 2]) * lerp * multiple
    }

    return pos
  }
  /** 计算肥面部肥胖度
   *
   * @param {number[]} pos 网格点
   * @param {CatGene} gene 基因
   * @param {number[]} base 标准网格点
   * @param {number} [multiple = 1] 倍数
   * @returns {Promise.<computePromiseObject, Error>} Promise
   * @memberof CatMaker
   */
  async COMPUTE_HEAD_FAT (pos, gene, base, multiple = 1) {
    const value = this.clamp(gene.headFat, 0, 1)
    const lerp = value < 0.5 ? 1 - 2 * value : 2 * value - 1

    const target = this.targets[value < 0.5 ? 'head_fat_min' : 'head_fat_max']
    for (let i of Object.keys(target)) {
      pos[i * 3 + 0] += (target[i].x - base[i * 3 + 0]) * lerp * multiple
      pos[i * 3 + 1] += (target[i].y - base[i * 3 + 1]) * lerp * multiple
      pos[i * 3 + 2] += (target[i].z - base[i * 3 + 2]) * lerp * multiple
    }

    return pos
  }
  /** 计算肥面部角度
   *
   * @param {number[]} pos 网格点
   * @param {CatGene} gene 基因
   * @param {number[]} base 标准网格点
   * @param {number} [multiple = 1] 倍数
   * @returns {Promise.<computePromiseObject, Error>} Promise
   * @memberof CatMaker
   */
  async COMPUTE_HEAD_ANGLE (pos, gene, base, multiple = 1) {
    const value = this.clamp(gene.headAngle, 0, 1)
    const lerp = value < 0.5 ? 1 - 2 * value : 2 * value - 1

    const target = this.targets[value < 0.5 ? 'head_angle_min' : 'head_angle_max']
    for (let i of Object.keys(target)) {
      pos[i * 3 + 0] += (target[i].x - base[i * 3 + 0]) * lerp * multiple
      pos[i * 3 + 1] += (target[i].y - base[i * 3 + 1]) * lerp * multiple
      pos[i * 3 + 2] += (target[i].z - base[i * 3 + 2]) * lerp * multiple
    }

    return pos
  }
  /** 计算肥面部椭圆形
   *
   * @param {number[]} pos 网格点
   * @param {CatGene} gene 基因
   * @param {number[]} base 标准网格点
   * @param {number} [multiple = 1] 倍数
   * @returns {Promise.<computePromiseObject, Error>} Promise
   * @memberof CatMaker
   */
  async COMPUTE_HEAD_OVAL (pos, gene, base, multiple = 1) {
    const value = this.clamp(gene.headOval - 0.5, 0, 1)
    const lerp = value < 0.5 ? 1 - 2 * value : 2 * value - 1

    const target = this.targets['head_oval']
    for (let i of Object.keys(target)) {
      pos[i * 3 + 0] += (target[i].x - base[i * 3 + 0]) * lerp * multiple
      pos[i * 3 + 1] += (target[i].y - base[i * 3 + 1]) * lerp * multiple
      pos[i * 3 + 2] += (target[i].z - base[i * 3 + 2]) * lerp * multiple
    }

    return pos
  }
  /** 计算肥面部圆形
   *
   * @param {number[]} pos 网格点
   * @param {CatGene} gene 基因
   * @param {number[]} base 标准网格点
   * @param {number} [multiple = 1] 倍数
   * @returns {Promise.<computePromiseObject, Error>} Promise
   * @memberof CatMaker
   */
  async COMPUTE_HEAD_ROUND (pos, gene, base, multiple = 1) {
    const value = this.clamp(gene.headRound - 0.5, 0, 1)
    const lerp = value < 0.5 ? 1 - 2 * value : 2 * value - 1

    const target = this.targets['head_round']
    for (let i of Object.keys(target)) {
      pos[i * 3 + 0] += (target[i].x - base[i * 3 + 0]) * lerp * multiple
      pos[i * 3 + 1] += (target[i].y - base[i * 3 + 1]) * lerp * multiple
      pos[i * 3 + 2] += (target[i].z - base[i * 3 + 2]) * lerp * multiple
    }

    return pos
  }
  /** 计算肥面部矩形
   *
   * @param {number[]} pos 网格点
   * @param {CatGene} gene 基因
   * @param {number[]} base 标准网格点
   * @param {number} [multiple = 1] 倍数
   * @returns {Promise.<computePromiseObject, Error>} Promise
   * @memberof CatMaker
   */
  async COMPUTE_HEAD_RECTANGULAR (pos, gene, base, multiple = 1) {
    const value = this.clamp(gene.headRectangular - 0.5, 0, 1)
    const lerp = value < 0.5 ? 1 - 2 * value : 2 * value - 1

    const target = this.targets['head_rectangular']
    for (let i of Object.keys(target)) {
      pos[i * 3 + 0] += (target[i].x - base[i * 3 + 0]) * lerp * multiple
      pos[i * 3 + 1] += (target[i].y - base[i * 3 + 1]) * lerp * multiple
      pos[i * 3 + 2] += (target[i].z - base[i * 3 + 2]) * lerp * multiple
    }

    return pos
  }
  /** 计算肥面部正方形
   *
   * @param {number[]} pos 网格点
   * @param {CatGene} gene 基因
   * @param {number[]} base 标准网格点
   * @param {number} [multiple = 1] 倍数
   * @returns {Promise.<computePromiseObject, Error>} Promise
   * @memberof CatMaker
   */
  async COMPUTE_HEAD_SQUARE (pos, gene, base, multiple = 1) {
    const value = this.clamp(gene.headSquare - 0.5, 0, 1)
    const lerp = value < 0.5 ? 1 - 2 * value : 2 * value - 1

    const target = this.targets['head_square']
    for (let i of Object.keys(target)) {
      pos[i * 3 + 0] += (target[i].x - base[i * 3 + 0]) * lerp * multiple
      pos[i * 3 + 1] += (target[i].y - base[i * 3 + 1]) * lerp * multiple
      pos[i * 3 + 2] += (target[i].z - base[i * 3 + 2]) * lerp * multiple
    }

    return pos
  }
  /** 计算肥面部三角形
   *
   * @param {number[]} pos 网格点
   * @param {CatGene} gene 基因
   * @param {number[]} base 标准网格点
   * @param {number} [multiple = 1] 倍数
   * @returns {Promise.<computePromiseObject, Error>} Promise
   * @memberof CatMaker
   */
  async COMPUTE_HEAD_TRIANGULAR (pos, gene, base, multiple = 1) {
    const value = this.clamp(gene.headTriangular - 0.5, 0, 1)
    const lerp = value < 0.5 ? 1 - 2 * value : 2 * value - 1

    const target = this.targets['head_triangular']
    for (let i of Object.keys(target)) {
      pos[i * 3 + 0] += (target[i].x - base[i * 3 + 0]) * lerp * multiple
      pos[i * 3 + 1] += (target[i].y - base[i * 3 + 1]) * lerp * multiple
      pos[i * 3 + 2] += (target[i].z - base[i * 3 + 2]) * lerp * multiple
    }

    return pos
  }
  /** 计算肥面部倒三角形
   *
   * @param {number[]} pos 网格点
   * @param {CatGene} gene 基因
   * @param {number[]} base 标准网格点
   * @param {number} [multiple = 1] 倍数
   * @returns {Promise.<computePromiseObject, Error>} Promise
   * @memberof CatMaker
   */
  async COMPUTE_HEAD_TRIANGULAR_INVERTED (pos, gene, base, multiple = 1) {
    const value = this.clamp(gene.headInvertedTriangular - 0.5, 0, 1)
    const lerp = value < 0.5 ? 1 - 2 * value : 2 * value - 1

    const target = this.targets['head_triangular_inverted']
    for (let i of Object.keys(target)) {
      pos[i * 3 + 0] += (target[i].x - base[i * 3 + 0]) * lerp * multiple
      pos[i * 3 + 1] += (target[i].y - base[i * 3 + 1]) * lerp * multiple
      pos[i * 3 + 2] += (target[i].z - base[i * 3 + 2]) * lerp * multiple
    }

    return pos
  }
  /** 计算肥面部菱形
   *
   * @param {number[]} pos 网格点
   * @param {CatGene} gene 基因
   * @param {number[]} base 标准网格点
   * @param {number} [multiple = 1] 倍数
   * @returns {Promise.<computePromiseObject, Error>} Promise
   * @memberof CatMaker
   */
  async COMPUTE_HEAD_DIAMOND (pos, gene, base, multiple = 1) {
    const value = this.clamp(gene.headDiamond - 0.5, 0, 1)
    const lerp = value < 0.5 ? 1 - 2 * value : 2 * value - 1

    const target = this.targets['head_diamond']
    for (let i of Object.keys(target)) {
      pos[i * 3 + 0] += (target[i].x - base[i * 3 + 0]) * lerp * multiple
      pos[i * 3 + 1] += (target[i].y - base[i * 3 + 1]) * lerp * multiple
      pos[i * 3 + 2] += (target[i].z - base[i * 3 + 2]) * lerp * multiple
    }

    return pos
  }
  /** 计算头顶缩放深度
   *
   * @param {number[]} pos 网格点
   * @param {CatGene} gene 基因
   * @param {number[]} base 标准网格点
   * @param {number} [multiple = 1] 倍数
   * @returns {Promise.<computePromiseObject, Error>} Promise
   * @memberof CatMaker
   */
  async COMPUTE_HEAD_PARIETAL_SCALE_DEPTH (pos, gene, base, multiple = 1) {
    const value = this.clamp(gene.headParietalScaleDepth, 0, 1)
    const lerp = value < 0.5 ? 1 - 2 * value : 2 * value - 1

    const target = this.targets[value < 0.5 ? 'head_parietal_scale_depth_min' : 'head_parietal_scale_depth_max']
    for (let i of Object.keys(target)) {
      pos[i * 3 + 0] += (target[i].x - base[i * 3 + 0]) * lerp * multiple
      pos[i * 3 + 1] += (target[i].y - base[i * 3 + 1]) * lerp * multiple
      pos[i * 3 + 2] += (target[i].z - base[i * 3 + 2]) * lerp * multiple
    }

    return pos
  }

  /** 计算头部缩放深度
   *
   * @param {number[]} pos 网格点
   * @param {CatGene} gene 基因
   * @param {number[]} base 标准网格点
   * @param {number} [multiple = 1] 倍数
   * @returns {Promise.<computePromiseObject, Error>} Promise
   * @memberof CatMaker
   */
  async COMPUTE_HEAD_SCALE_DEPTH (pos, gene, base, multiple = 1) {
    const value = this.clamp(gene.headScaleDepth, 0, 1)
    const lerp = value < 0.5 ? 1 - 2 * value : 2 * value - 1

    const target = this.targets[value < 0.5 ? 'head_scale_depth_min' : 'head_scale_depth_max']
    for (let i of Object.keys(target)) {
      pos[i * 3 + 0] += (target[i].x - base[i * 3 + 0]) * lerp * multiple
      pos[i * 3 + 1] += (target[i].y - base[i * 3 + 1]) * lerp * multiple
      pos[i * 3 + 2] += (target[i].z - base[i * 3 + 2]) * lerp * multiple
    }

    return pos
  }
  /** 计算头部水平缩放
   *
   * @param {number[]} pos 网格点
   * @param {CatGene} gene 基因
   * @param {number[]} base 标准网格点
   * @param {number} [multiple = 1] 倍数
   * @returns {Promise.<computePromiseObject, Error>} Promise
   * @memberof CatMaker
   */
  async COMPUTE_HEAD_SCALE_HORIZONTALLY (pos, gene, base, multiple = 1) {
    const value = this.clamp(gene.headScaleHorizontally, 0, 1)
    const lerp = value < 0.5 ? 1 - 2 * value : 2 * value - 1

    const target = this.targets[value < 0.5 ? 'head_scale_horizontally_min' : 'head_scale_horizontally_max']
    for (let i of Object.keys(target)) {
      pos[i * 3 + 0] += (target[i].x - base[i * 3 + 0]) * lerp * multiple
      pos[i * 3 + 1] += (target[i].y - base[i * 3 + 1]) * lerp * multiple
      pos[i * 3 + 2] += (target[i].z - base[i * 3 + 2]) * lerp * multiple
    }

    return pos
  }
  /** 计算头部垂直缩放
   *
   * @param {number[]} pos 网格点
   * @param {CatGene} gene 基因
   * @param {number[]} base 标准网格点
   * @param {number} [multiple = 1] 倍数
   * @returns {Promise.<computePromiseObject, Error>} Promise
   * @memberof CatMaker
   */
  async COMPUTE_HEAD_SCALE_VERTICALLY (pos, gene, base, multiple = 1) {
    const value = this.clamp(gene.headScaleVertically, 0, 1)
    const lerp = value < 0.5 ? 1 - 2 * value : 2 * value - 1

    const target = this.targets[value < 0.5 ? 'head_scale_vertically_min' : 'head_scale_vertically_max']
    for (let i of Object.keys(target)) {
      pos[i * 3 + 0] += (target[i].x - base[i * 3 + 0]) * lerp * multiple
      pos[i * 3 + 1] += (target[i].y - base[i * 3 + 1]) * lerp * multiple
      pos[i * 3 + 2] += (target[i].z - base[i * 3 + 2]) * lerp * multiple
    }

    return pos
  }
  /** 计算头部深度位移
   *
   * @param {number[]} pos 网格点
   * @param {CatGene} gene 基因
   * @param {number[]} base 标准网格点
   * @param {number} [multiple = 1] 倍数
   * @returns {Promise.<computePromiseObject, Error>} Promise
   * @memberof CatMaker
   */
  async COMPUTE_HEAD_MOVE_DEPTH (pos, gene, base, multiple = 1) {
    const value = this.clamp(gene.headMoveDepth, 0, 1)
    const lerp = value < 0.5 ? 1 - 2 * value : 2 * value - 1

    const target = this.targets[value < 0.5 ? 'head_move_depth_min' : 'head_move_depth_max']
    for (let i of Object.keys(target)) {
      pos[i * 3 + 0] += (target[i].x - base[i * 3 + 0]) * lerp * multiple
      pos[i * 3 + 1] += (target[i].y - base[i * 3 + 1]) * lerp * multiple
      pos[i * 3 + 2] += (target[i].z - base[i * 3 + 2]) * lerp * multiple
    }

    return pos
  }
  /** 计算头部水平位移
   *
   * @param {number[]} pos 网格点
   * @param {CatGene} gene 基因
   * @param {number[]} base 标准网格点
   * @param {number} [multiple = 1] 倍数
   * @returns {Promise.<computePromiseObject, Error>} Promise
   * @memberof CatMaker
   */
  async COMPUTE_HEAD_MOVE_HORIZONTALLY (pos, gene, base, multiple = 1) {
    const value = this.clamp(gene.headMoveHorizontally, 0, 1)
    const lerp = value < 0.5 ? 1 - 2 * value : 2 * value - 1

    const target = this.targets[value < 0.5 ? 'head_move_horizontally_min' : 'head_move_horizontally_max']
    for (let i of Object.keys(target)) {
      pos[i * 3 + 0] += (target[i].x - base[i * 3 + 0]) * lerp * multiple
      pos[i * 3 + 1] += (target[i].y - base[i * 3 + 1]) * lerp * multiple
      pos[i * 3 + 2] += (target[i].z - base[i * 3 + 2]) * lerp * multiple
    }

    return pos
  }
  /** 计算头部垂直位移
   *
   * @param {number[]} pos 网格点
   * @param {CatGene} gene 基因
   * @param {number[]} base 标准网格点
   * @param {number} [multiple = 1] 倍数
   * @returns {Promise.<computePromiseObject, Error>} Promise
   * @memberof CatMaker
   */
  async COMPUTE_HEAD_MOVE_VERTICALLY (pos, gene, base, multiple = 1) {
    const value = this.clamp(gene.headMoveVertically, 0, 1)
    const lerp = value < 0.5 ? 1 - 2 * value : 2 * value - 1

    const target = this.targets[value < 0.5 ? 'head_move_vertically_min' : 'head_move_vertically_max']
    for (let i of Object.keys(target)) {
      pos[i * 3 + 0] += (target[i].x - base[i * 3 + 0]) * lerp * multiple
      pos[i * 3 + 1] += (target[i].y - base[i * 3 + 1]) * lerp * multiple
      pos[i * 3 + 2] += (target[i].z - base[i * 3 + 2]) * lerp * multiple
    }

    return pos
  }
  /** 计算额头凸起
   *
   * @param {number[]} pos 网格点
   * @param {CatGene} gene 基因
   * @param {number[]} base 标准网格点
   * @param {number} [multiple = 1] 倍数
   * @returns {Promise.<computePromiseObject, Error>} Promise
   * @memberof CatMaker
   */
  async COMPUTE_FOREHEAD_BULGE (pos, gene, base, multiple = 1) {
    const value = this.clamp(gene.foreheadBulge, 0, 1)
    const lerp = value < 0.5 ? 1 - 2 * value : 2 * value - 1

    const target = this.targets[value < 0.5 ? 'forehead_bulge_min' : 'forehead_bulge_max']
    for (let i of Object.keys(target)) {
      pos[i * 3 + 0] += (target[i].x - base[i * 3 + 0]) * lerp * multiple
      pos[i * 3 + 1] += (target[i].y - base[i * 3 + 1]) * lerp * multiple
      pos[i * 3 + 2] += (target[i].z - base[i * 3 + 2]) * lerp * multiple
    }

    return pos
  }
  /** 计算额头垂直缩放
   *
   * @param {number[]} pos 网格点
   * @param {CatGene} gene 基因
   * @param {number[]} base 标准网格点
   * @param {number} [multiple = 1] 倍数
   * @returns {Promise.<computePromiseObject, Error>} Promise
   * @memberof CatMaker
   */
  async COMPUTE_FOREHEAD_SCALE_VERTICALLY (pos, gene, base, multiple = 1) {
    const value = this.clamp(gene.foreheadScaleVertically, 0, 1)
    const lerp = value < 0.5 ? 1 - 2 * value : 2 * value - 1

    const target = this.targets[value < 0.5 ? 'forehead_scale_vertically_max' : 'forehead_scale_vertically_max']
    for (let i of Object.keys(target)) {
      pos[i * 3 + 0] += (target[i].x - base[i * 3 + 0]) * lerp * multiple
      pos[i * 3 + 1] += (target[i].y - base[i * 3 + 1]) * lerp * multiple
      pos[i * 3 + 2] += (target[i].z - base[i * 3 + 2]) * lerp * multiple
    }

    return pos
  }
  /** 计算额头颅骨凸起
   *
   * @param {number[]} pos 网格点
   * @param {CatGene} gene 基因
   * @param {number[]} base 标准网格点
   * @param {number} [multiple = 1] 倍数
   * @returns {Promise.<computePromiseObject, Error>} Promise
   * @memberof CatMaker
   */
  async COMPUTE_FOREHEAD_CRANIC_SHAPE (pos, gene, base, multiple = 1) { return pos }
  /** 计算额头太阳穴凸起
   *
   * @param {number[]} pos 网格点
   * @param {CatGene} gene 基因
   * @param {number[]} base 标准网格点
   * @param {number} [multiple = 1] 倍数
   * @returns {Promise.<computePromiseObject, Error>} Promise
   * @memberof CatMaker
   */
  async COMPUTE_FOREHEAD_TEMPLE_BULGE (pos, gene, base, multiple = 1) {
    const value = this.clamp(gene.foreheadTempleBulge, 0, 1)
    const lerp = value < 0.5 ? 1 - 2 * value : 2 * value - 1

    const target = this.targets[value < 0.5 ? 'forehead_temple_bulge_min' : 'forehead_temple_bulge_max']
    for (let i of Object.keys(target)) {
      pos[i * 3 + 0] += (target[i].x - base[i * 3 + 0]) * lerp * multiple
      pos[i * 3 + 1] += (target[i].y - base[i * 3 + 1]) * lerp * multiple
      pos[i * 3 + 2] += (target[i].z - base[i * 3 + 2]) * lerp * multiple
    }

    return pos
  }

  /** 计算眉骨凸起
   *
   * @param {number[]} pos 网格点
   * @param {CatGene} gene 基因
   * @param {number[]} base 标准网格点
   * @param {number} [multiple = 1] 倍数
   * @returns {Promise.<computePromiseObject, Error>} Promise
   * @memberof CatMaker
   */
  async COMPUTE_EYEBROWS_BULGE (pos, gene, base, multiple = 1) {
    const value = this.clamp(gene.eyebrowsBulge, 0, 1)
    const lerp = value < 0.5 ? 1 - 2 * value : 2 * value - 1

    const target = this.targets[value < 0.5 ? 'eyebrows_bulge_min' : 'eyebrows_bulge_max']
    for (let i of Object.keys(target)) {
      pos[i * 3 + 0] += (target[i].x - base[i * 3 + 0]) * lerp * multiple
      pos[i * 3 + 1] += (target[i].y - base[i * 3 + 1]) * lerp * multiple
      pos[i * 3 + 2] += (target[i].z - base[i * 3 + 2]) * lerp * multiple
    }

    return pos
  }
  /** 计算眉骨角度
   *
   * @param {number[]} pos 网格点
   * @param {CatGene} gene 基因
   * @param {number[]} base 标准网格点
   * @param {number} [multiple = 1] 倍数
   * @returns {Promise.<computePromiseObject, Error>} Promise
   * @memberof CatMaker
   */
  async COMPUTE_EYEBROWS_ANGLE (pos, gene, base, multiple = 1) {
    const value = this.clamp(gene.eyebrowsAngle, 0, 1)
    const lerp = value < 0.5 ? 1 - 2 * value : 2 * value - 1

    const target = this.targets[value < 0.5 ? 'eyebrows_angle_min' : 'eyebrows_angle_max']
    for (let i of Object.keys(target)) {
      pos[i * 3 + 0] += (target[i].x - base[i * 3 + 0]) * lerp * multiple
      pos[i * 3 + 1] += (target[i].y - base[i * 3 + 1]) * lerp * multiple
      pos[i * 3 + 2] += (target[i].z - base[i * 3 + 2]) * lerp * multiple
    }

    return pos
  }
  /** 计算眉骨垂直位移
   *
   * @param {number[]} pos 网格点
   * @param {CatGene} gene 基因
   * @param {number[]} base 标准网格点
   * @param {number} [multiple = 1] 倍数
   * @returns {Promise.<computePromiseObject, Error>} Promise
   * @memberof CatMaker
   */
  async COMPUTE_EYEBROWS_MOVE_VERTICALLY (pos, gene, base, multiple = 1) {
    const value = this.clamp(gene.eyebrowsMoveVertically, 0, 1)
    const lerp = value < 0.5 ? 1 - 2 * value : 2 * value - 1

    const target = this.targets[value < 0.5 ? 'eyebrows_move_vertically_min' : 'eyebrows_move_vertically_max']
    for (let i of Object.keys(target)) {
      pos[i * 3 + 0] += (target[i].x - base[i * 3 + 0]) * lerp * multiple
      pos[i * 3 + 1] += (target[i].y - base[i * 3 + 1]) * lerp * multiple
      pos[i * 3 + 2] += (target[i].z - base[i * 3 + 2]) * lerp * multiple
    }

    return pos
  }

  /** 计算颈部双下巴
   *
   * @param {number[]} pos 网格点
   * @param {CatGene} gene 基因
   * @param {number[]} base 标准网格点
   * @param {number} [multiple = 1] 倍数
   * @returns {Promise.<computePromiseObject, Error>} Promise
   * @memberof CatMaker
   */
  async COMPUTE_NECK_DOUBLE (pos, gene, base, multiple = 1) {
    const value = this.clamp(gene.eyebrowsMoveVertically, 0, 1)
    const lerp = value < 0.5 ? 1 - 2 * value : 2 * value - 1

    const target = this.targets[value < 0.5 ? 'eyebrows_move_vertically_min' : 'eyebrows_move_vertically_max']
    for (let i of Object.keys(target)) {
      pos[i * 3 + 0] += (target[i].x - base[i * 3 + 0]) * lerp * multiple
      pos[i * 3 + 1] += (target[i].y - base[i * 3 + 1]) * lerp * multiple
      pos[i * 3 + 2] += (target[i].z - base[i * 3 + 2]) * lerp * multiple
    }

    return pos
  }
  /** 计算颈部深度缩放
   *
   * @param {number[]} pos 网格点
   * @param {CatGene} gene 基因
   * @param {number[]} base 标准网格点
   * @param {number} [multiple = 1] 倍数
   * @returns {Promise.<computePromiseObject, Error>} Promise
   * @memberof CatMaker
   */
  async COMPUTE_NECK_SCALE_DEPTH (pos, gene, base, multiple = 1) {
    const value = this.clamp(gene.neckScaleDepth, 0, 1)
    const lerp = value < 0.5 ? 1 - 2 * value : 2 * value - 1

    const target = this.targets[value < 0.5 ? 'neck_scale_depth_min' : 'neck_scale_depth_max']
    for (let i of Object.keys(target)) {
      pos[i * 3 + 0] += (target[i].x - base[i * 3 + 0]) * lerp * multiple
      pos[i * 3 + 1] += (target[i].y - base[i * 3 + 1]) * lerp * multiple
      pos[i * 3 + 2] += (target[i].z - base[i * 3 + 2]) * lerp * multiple
    }

    return pos
  }
  /** 计算后颈深度缩放
   *
   * @param {number[]} pos 网格点
   * @param {CatGene} gene 基因
   * @param {number[]} base 标准网格点
   * @param {number} [multiple = 1] 倍数
   * @returns {Promise.<computePromiseObject, Error>} Promise
   * @memberof CatMaker
   */
  async COMPUTE_NECK_SCALE_DEPTH_OF_NAPE (pos, gene, base, multiple = 1) {
    const value = this.clamp(gene.neckScaleDepthOfNape, 0, 1)
    const lerp = value < 0.5 ? 1 - 2 * value : 2 * value - 1

    const target = this.targets[value < 0.5 ? 'neck_scale_depth_of_nape_min' : 'neck_scale_depth_of_nape_max']
    for (let i of Object.keys(target)) {
      pos[i * 3 + 0] += (target[i].x - base[i * 3 + 0]) * lerp * multiple
      pos[i * 3 + 1] += (target[i].y - base[i * 3 + 1]) * lerp * multiple
      pos[i * 3 + 2] += (target[i].z - base[i * 3 + 2]) * lerp * multiple
    }

    return pos
  }
  /** 计算颈部水平缩放
   *
   * @param {number[]} pos 网格点
   * @param {CatGene} gene 基因
   * @param {number[]} base 标准网格点
   * @param {number} [multiple = 1] 倍数
   * @returns {Promise.<computePromiseObject, Error>} Promise
   * @memberof CatMaker
   */
  async COMPUTE_NECK_SCALE_HORIZONTALLY (pos, gene, base, multiple = 1) {
    const value = this.clamp(gene.neckScaleHorizontally, 0, 1)
    const lerp = value < 0.5 ? 1 - 2 * value : 2 * value - 1

    const target = this.targets[value < 0.5 ? 'neck_scale_horizontally_min' : 'neck_scale_horizontally_max']
    for (let i of Object.keys(target)) {
      pos[i * 3 + 0] += (target[i].x - base[i * 3 + 0]) * lerp * multiple
      pos[i * 3 + 1] += (target[i].y - base[i * 3 + 1]) * lerp * multiple
      pos[i * 3 + 2] += (target[i].z - base[i * 3 + 2]) * lerp * multiple
    }

    return pos
  }
  /** 计算颈部垂直缩放
   *
   * @param {number[]} pos 网格点
   * @param {CatGene} gene 基因
   * @param {number[]} base 标准网格点
   * @param {number} [multiple = 1] 倍数
   * @returns {Promise.<computePromiseObject, Error>} Promise
   * @memberof CatMaker
   */
  async COMPUTE_NECK_SCALE_VERTICALLY (pos, gene, base, multiple = 1) {
    const value = this.clamp(gene.neckScaleVertically, 0, 1)
    const lerp = value < 0.5 ? 1 - 2 * value : 2 * value - 1

    const target = this.targets[value < 0.5 ? 'neck_scale_vertically_min' : 'neck_scale_vertically_max']
    for (let i of Object.keys(target)) {
      pos[i * 3 + 0] += (target[i].x - base[i * 3 + 0]) * lerp * multiple
      pos[i * 3 + 1] += (target[i].y - base[i * 3 + 1]) * lerp * multiple
      pos[i * 3 + 2] += (target[i].z - base[i * 3 + 2]) * lerp * multiple
    }

    return pos
  }
  /** 计算颈部深度位移
   *
   * @param {number[]} pos 网格点
   * @param {CatGene} gene 基因
   * @param {number[]} base 标准网格点
   * @param {number} [multiple = 1] 倍数
   * @returns {Promise.<computePromiseObject, Error>} Promise
   * @memberof CatMaker
   */
  async COMPUTE_NECK_MOVE_DEPTH (pos, gene, base, multiple = 1) { return pos }
  /** 计算颈部水平位移
   *
   * @param {number[]} pos 网格点
   * @param {CatGene} gene 基因
   * @param {number[]} base 标准网格点
   * @param {number} [multiple = 1] 倍数
   * @returns {Promise.<computePromiseObject, Error>} Promise
   * @memberof CatMaker
   */
  async COMPUTE_NECK_MOVE_HORIZONTALLY (pos, gene, base, multiple = 1) { return pos }
  /** 计算颈部垂直位移
   *
   * @param {number[]} pos 网格点
   * @param {CatGene} gene 基因
   * @param {number[]} base 标准网格点
   * @param {number} [multiple = 1] 倍数
   * @returns {Promise.<computePromiseObject, Error>} Promise
   * @memberof CatMaker
   */
  async COMPUTE_NECK_MOVE_VERTICALLY (pos, gene, base, multiple = 1) { return pos }

  /** 计算眼袋体积
   *
   * @param {number[]} pos 网格点
   * @param {CatGene} gene 基因
   * @param {number[]} base 标准网格点
   * @param {number} [multiple = 1] 倍数
   * @returns {Promise.<computePromiseObject, Error>} Promise
   * @memberof CatMaker
   */
  async COMPUTE_EYE_BAG_VOLUME (pos, gene, base, multiple = 1) {
    const value = this.clamp(gene.eyeBagVolume, 0, 1)
    const lerp = value < 0.5 ? 1 - 2 * value : 2 * value - 1

    const target = this.targets[value < 0.5 ? 'eye_bag_volume_min' : 'eye_bag_volume_max']
    for (let i of Object.keys(target)) {
      pos[i * 3 + 0] += (target[i].x - base[i * 3 + 0]) * lerp * multiple
      pos[i * 3 + 1] += (target[i].y - base[i * 3 + 1]) * lerp * multiple
      pos[i * 3 + 2] += (target[i].z - base[i * 3 + 2]) * lerp * multiple
    }

    return pos
  }
  /** 计算眼袋歪曲
   *
   * @param {number[]} pos 网格点
   * @param {CatGene} gene 基因
   * @param {number[]} base 标准网格点
   * @param {number} [multiple = 1] 倍数
   * @returns {Promise.<computePromiseObject, Error>} Promise
   * @memberof CatMaker
   */
  async COMPUTE_EYE_BAG_DISTORSION (pos, gene, base, multiple = 1) {
    const value = this.clamp(gene.eyeBagDistorsion, 0, 1)
    let lerp = value < 0.5 ? 1 - 2 * value : 2 * value - 1

    const target = this.targets[value < 0.5 ? 'eye_bag_distorsion_min' : 'eye_bag_distorsion_max']
    lerp *= multiple
    for (let i of Object.keys(target)) {
      pos[i * 3 + 0] += (target[i].x - base[i * 3 + 0]) * lerp * multiple
      pos[i * 3 + 1] += (target[i].y - base[i * 3 + 1]) * lerp * multiple
      pos[i * 3 + 2] += (target[i].z - base[i * 3 + 2]) * lerp * multiple
    }

    return pos
  }
  /** 计算眼袋高度
   *
   * @param {number[]} pos 网格点
   * @param {CatGene} gene 基因
   * @param {number[]} base 标准网格点
   * @param {number} [multiple = 1] 倍数
   * @returns {Promise.<computePromiseObject, Error>} Promise
   * @memberof CatMaker
   */
  async COMPUTE_EYE_BAG_HEIGHT (pos, gene, base, multiple = 1) {
    const value = this.clamp(gene.eyeBagHeight, 0, 1)
    const lerp = value < 0.5 ? 1 - 2 * value : 2 * value - 1

    const target = this.targets[value < 0.5 ? 'eye_bag_height_min' : 'eye_bag_height_max']
    for (let i of Object.keys(target)) {
      pos[i * 3 + 0] += (target[i].x - base[i * 3 + 0]) * lerp * multiple
      pos[i * 3 + 1] += (target[i].y - base[i * 3 + 1]) * lerp * multiple
      pos[i * 3 + 2] += (target[i].z - base[i * 3 + 2]) * lerp * multiple
    }

    return pos
  }
  /** 计算眼褶角度
   *
   * @param {number[]} pos 网格点
   * @param {CatGene} gene 基因
   * @param {number[]} base 标准网格点
   * @param {number} [multiple = 1] 倍数
   * @returns {Promise.<computePromiseObject, Error>} Promise
   * @memberof CatMaker
   */
  async COMPUTE_EYE_FOLD_ANGLE (pos, gene, base, multiple = 1) {
    const value = this.clamp(gene.eyeFoldAngle, 0, 1)
    const lerp = value < 0.5 ? 1 - 2 * value : 2 * value - 1

    const target = this.targets[value < 0.5 ? 'eye_fold_angle_min' : 'eye_fold_angle_max']
    for (let i of Object.keys(target)) {
      pos[i * 3 + 0] += (target[i].x - base[i * 3 + 0]) * lerp * multiple
      pos[i * 3 + 1] += (target[i].y - base[i * 3 + 1]) * lerp * multiple
      pos[i * 3 + 2] += (target[i].z - base[i * 3 + 2]) * lerp * multiple
    }

    return pos
  }
  /** 计算眼褶体积
   *
   * @param {number[]} pos 网格点
   * @param {CatGene} gene 基因
   * @param {number[]} base 标准网格点
   * @param {number} [multiple = 1] 倍数
   * @returns {Promise.<computePromiseObject, Error>} Promise
   * @memberof CatMaker
   */
  async COMPUTE_EYE_FOLD_VOLUME (pos, gene, base, multiple = 1) {
    const value = this.clamp(gene.eyeFoldVolume, 0, 1)
    const lerp = value < 0.5 ? 1 - 2 * value : 2 * value - 1

    const target = this.targets[value < 0.5 ? 'eye_fold_volume_min' : 'eye_fold_volume_max']
    for (let i of Object.keys(target)) {
      pos[i * 3 + 0] += (target[i].x - base[i * 3 + 0]) * lerp * multiple
      pos[i * 3 + 1] += (target[i].y - base[i * 3 + 1]) * lerp * multiple
      pos[i * 3 + 2] += (target[i].z - base[i * 3 + 2]) * lerp * multiple
    }

    return pos
  }
  /** 计算眼内眦赘皮深度
   *
   * @param {number[]} pos 网格点
   * @param {CatGene} gene 基因
   * @param {number[]} base 标准网格点
   * @param {number} [multiple = 1] 倍数
   * @returns {Promise.<computePromiseObject, Error>} Promise
   * @memberof CatMaker
   */
  async COMPUTE_EYE_EPICANTHUS (pos, gene, base, multiple = 1) {
    const value = this.clamp(gene.eyeEpicanthus, 0, 1)
    const lerp = value < 0.5 ? 1 - 2 * value : 2 * value - 1

    const target = this.targets[value < 0.5 ? 'eye_epicanthus_min' : 'eye_epicanthus_max']
    for (let i of Object.keys(target)) {
      pos[i * 3 + 0] += (target[i].x - base[i * 3 + 0]) * lerp * multiple
      pos[i * 3 + 1] += (target[i].y - base[i * 3 + 1]) * lerp * multiple
      pos[i * 3 + 2] += (target[i].z - base[i * 3 + 2]) * lerp * multiple
    }

    return pos
  }
  /** 计算高度（内眼角方向开始）
   *
   * @param {number[]} pos 网格点
   * @param {CatGene} gene 基因
   * @param {number[]} base 标准网格点
   * @param {number} [multiple = 1] 倍数
   * @returns {Promise.<computePromiseObject, Error>} Promise
   * @memberof CatMaker
   */
  async COMPUTE_EYE_SCALEHEIGHT_0 (pos, gene, base, multiple = 1) {
    const value = this.clamp(gene.eyeScaleHeight0, 0, 1)
    const lerp = value < 0.5 ? 1 - 2 * value : 2 * value - 1

    const target = this.targets[value < 0.5 ? 'eye_scale_height_0_min' : 'eye_scale_height_0_max']
    for (let i of Object.keys(target)) {
      pos[i * 3 + 0] += (target[i].x - base[i * 3 + 0]) * lerp * multiple
      pos[i * 3 + 1] += (target[i].y - base[i * 3 + 1]) * lerp * multiple
      pos[i * 3 + 2] += (target[i].z - base[i * 3 + 2]) * lerp * multiple
    }

    return pos
  }
  /** 计算高度（内眼角方向开始）
   *
   * @param {number[]} pos 网格点
   * @param {CatGene} gene 基因
   * @param {number[]} base 标准网格点
   * @param {number} [multiple = 1] 倍数
   * @returns {Promise.<computePromiseObject, Error>} Promise
   * @memberof CatMaker
   */
  async COMPUTE_EYE_SCALEHEIGHT_1 (pos, gene, base, multiple = 1) {
    const value = this.clamp(gene.eyeScaleHeight1, 0, 1)
    const lerp = value < 0.5 ? 1 - 2 * value : 2 * value - 1

    const target = this.targets[value < 0.5 ? 'eye_scale_height_1_min' : 'eye_scale_height_1_max']
    for (let i of Object.keys(target)) {
      pos[i * 3 + 0] += (target[i].x - base[i * 3 + 0]) * lerp * multiple
      pos[i * 3 + 1] += (target[i].y - base[i * 3 + 1]) * lerp * multiple
      pos[i * 3 + 2] += (target[i].z - base[i * 3 + 2]) * lerp * multiple
    }

    return pos
  }
  /** 计算高度（内眼角方向开始）
   *
   * @param {number[]} pos 网格点
   * @param {CatGene} gene 基因
   * @param {number[]} base 标准网格点
   * @param {number} [multiple = 1] 倍数
   * @returns {Promise.<computePromiseObject, Error>} Promise
   * @memberof CatMaker
   */
  async COMPUTE_EYE_SCALEHEIGHT_2 (pos, gene, base, multiple = 1) {
    const value = this.clamp(gene.eyeScaleHeight2, 0, 1)
    const lerp = value < 0.5 ? 1 - 2 * value : 2 * value - 1

    const target = this.targets[value < 0.5 ? 'eye_scale_height_2_min' : 'eye_scale_height_2_max']
    for (let i of Object.keys(target)) {
      pos[i * 3 + 0] += (target[i].x - base[i * 3 + 0]) * lerp * multiple
      pos[i * 3 + 1] += (target[i].y - base[i * 3 + 1]) * lerp * multiple
      pos[i * 3 + 2] += (target[i].z - base[i * 3 + 2]) * lerp * multiple
    }

    return pos
  }
  /** 计算高度（内眼角方向开始）
   *
   * @param {number[]} pos 网格点
   * @param {CatGene} gene 基因
   * @param {number[]} base 标准网格点
   * @param {number} [multiple = 1] 倍数
   * @returns {Promise.<computePromiseObject, Error>} Promise
   * @memberof CatMaker
   */
  async COMPUTE_EYE_SCALEHEIGHT_3 (pos, gene, base, multiple = 1) {
    const value = this.clamp(gene.eyeScaleHeight3, 0, 1)
    const lerp = value < 0.5 ? 1 - 2 * value : 2 * value - 1

    const target = this.targets[value < 0.5 ? 'eye_scale_height_3_min' : 'eye_scale_height_3_max']
    for (let i of Object.keys(target)) {
      pos[i * 3 + 0] += (target[i].x - base[i * 3 + 0]) * lerp * multiple
      pos[i * 3 + 1] += (target[i].y - base[i * 3 + 1]) * lerp * multiple
      pos[i * 3 + 2] += (target[i].z - base[i * 3 + 2]) * lerp * multiple
    }

    return pos
  }
  /** 计算高度（内眼角方向开始）
   *
   * @param {number[]} pos 网格点
   * @param {CatGene} gene 基因
   * @param {number[]} base 标准网格点
   * @param {number} [multiple = 1] 倍数
   * @returns {Promise.<computePromiseObject, Error>} Promise
   * @memberof CatMaker
   */
  async COMPUTE_EYE_SCALEHEIGHT_4 (pos, gene, base, multiple = 1) {
    const value = this.clamp(gene.eyeScaleHeight4, 0, 1)
    const lerp = value < 0.5 ? 1 - 2 * value : 2 * value - 1

    const target = this.targets[value < 0.5 ? 'eye_scale_height_4_min' : 'eye_scale_height_4_max']
    for (let i of Object.keys(target)) {
      pos[i * 3 + 0] += (target[i].x - base[i * 3 + 0]) * lerp * multiple
      pos[i * 3 + 1] += (target[i].y - base[i * 3 + 1]) * lerp * multiple
      pos[i * 3 + 2] += (target[i].z - base[i * 3 + 2]) * lerp * multiple
    }

    return pos
  }
  /** 计算眼角水平位移
   *
   * @param {number[]} pos 网格点
   * @param {CatGene} gene 基因
   * @param {number[]} base 标准网格点
   * @param {number} [multiple = 1] 倍数
   * @returns {Promise.<computePromiseObject, Error>} Promise
   * @memberof CatMaker
   */
  async COMPUTE_EYE_MOVE_OUTER_CORNER_HORIZONTALLY (pos, gene, base, multiple = 1) {
    const value = this.clamp(gene.eyeMoveOuterCornerHorizontally, 0, 1)
    const lerp = value < 0.5 ? 1 - 2 * value : 2 * value - 1

    const target = this.targets[value < 0.5 ? 'eye_move_outer_corner_horizontally_min' : 'eye_move_outer_corner_horizontally_max']
    for (let i of Object.keys(target)) {
      pos[i * 3 + 0] += (target[i].x - base[i * 3 + 0]) * lerp * multiple
      pos[i * 3 + 1] += (target[i].y - base[i * 3 + 1]) * lerp * multiple
      pos[i * 3 + 2] += (target[i].z - base[i * 3 + 2]) * lerp * multiple
    }

    return pos
  }
  /** 计算内眼角水平位移
   *
   * @param {number[]} pos 网格点
   * @param {CatGene} gene 基因
   * @param {number[]} base 标准网格点
   * @param {number} [multiple = 1] 倍数
   * @returns {Promise.<computePromiseObject, Error>} Promise
   * @memberof CatMaker
   */
  async COMPUTE_EYE_MOVE_INNER_CORNER_HORIZONTALLY (pos, gene, base, multiple = 1) {
    const value = this.clamp(gene.eyeMoveInnerCornerHorizontally, 0, 1)
    const lerp = value < 0.5 ? 1 - 2 * value : 2 * value - 1

    const target = this.targets[value < 0.5 ? 'eye_move_innter_corner_horizontally_min' : 'eye_move_innter_corner_horizontally_max']
    for (let i of Object.keys(target)) {
      pos[i * 3 + 0] += (target[i].x - base[i * 3 + 0]) * lerp * multiple
      pos[i * 3 + 1] += (target[i].y - base[i * 3 + 1]) * lerp * multiple
      pos[i * 3 + 2] += (target[i].z - base[i * 3 + 2]) * lerp * multiple
    }

    return pos
  }
  /** 计算眼角垂直位移
   *
   * @param {number[]} pos 网格点
   * @param {CatGene} gene 基因
   * @param {number[]} base 标准网格点
   * @param {number} [multiple = 1] 倍数
   * @returns {Promise.<computePromiseObject, Error>} Promise
   * @memberof CatMaker
   */
  async COMPUTE_EYE_MOVE_OUTER_CORNER_VERTICALLY (pos, gene, base, multiple = 1) {
    const value = this.clamp(gene.eyeMoveOuterCornerVertically, 0, 1)
    const lerp = value < 0.5 ? 1 - 2 * value : 2 * value - 1

    const target = this.targets[value < 0.5 ? 'eye_move_outer_corner_vertically_min' : 'eye_move_outer_corner_vertically_max']
    for (let i of Object.keys(target)) {
      pos[i * 3 + 0] += (target[i].x - base[i * 3 + 0]) * lerp * multiple
      pos[i * 3 + 1] += (target[i].y - base[i * 3 + 1]) * lerp * multiple
      pos[i * 3 + 2] += (target[i].z - base[i * 3 + 2]) * lerp * multiple
    }

    return pos
  }
  /** 计算内眼角垂直位移
   *
   * @param {number[]} pos 网格点
   * @param {CatGene} gene 基因
   * @param {number[]} base 标准网格点
   * @param {number} [multiple = 1] 倍数
   * @returns {Promise.<computePromiseObject, Error>} Promise
   * @memberof CatMaker
   */
  async COMPUTE_EYE_MOVE_INNER_CORNER_VERTICALLY (pos, gene, base, multiple = 1) {
    const value = this.clamp(gene.eyeMoveInnerCornerVertically, 0, 1)
    const lerp = value < 0.5 ? 1 - 2 * value : 2 * value - 1

    const target = this.targets[value < 0.5 ? 'eye_move_innter_corner_vertically_min' : 'eye_move_innter_corner_vertically_max']
    for (let i of Object.keys(target)) {
      pos[i * 3 + 0] += (target[i].x - base[i * 3 + 0]) * lerp * multiple
      pos[i * 3 + 1] += (target[i].y - base[i * 3 + 1]) * lerp * multiple
      pos[i * 3 + 2] += (target[i].z - base[i * 3 + 2]) * lerp * multiple
    }

    return pos
  }
  /** 计算眼睛水平移动
   *
   * @param {number[]} pos 网格点
   * @param {CatGene} gene 基因
   * @param {number[]} base 标准网格点
   * @param {number} [multiple = 1] 倍数
   * @returns {Promise.<computePromiseObject, Error>} Promise
   * @memberof CatMaker
   */
  async COMPUTE_EYE_MOVE_HORIZONTALLY (pos, gene, base, multiple = 1) { return pos }
  /** 计算眼睛垂直移动
   *
   * @param {number[]} pos 网格点
   * @param {CatGene} gene 基因
   * @param {number[]} base 标准网格点
   * @param {number} [multiple = 1] 倍数
   * @returns {Promise.<computePromiseObject, Error>} Promise
   * @memberof CatMaker
   */
  async COMPUTE_EYE_MOVE_VERTICALLY (pos, gene, base, multiple = 1) { return pos }
  /** 计算眼睛缩放
   *
   * @param {number[]} pos 网格点
   * @param {CatGene} gene 基因
   * @param {number[]} base 标准网格点
   * @param {number} [multiple = 1] 倍数
   * @returns {Promise.<computePromiseObject, Error>} Promise
   * @memberof CatMaker
   */
  async COMPUTE_EYE_SCALE (pos, gene, base, multiple = 1) {
    const value = this.clamp(gene.eyeScale, 0, 1)
    const lerp = value < 0.5 ? 1 - 2 * value : 2 * value - 1

    const target = this.targets[value < 0.5 ? 'eye_scale_min' : 'eye_scale_max']
    for (let i of Object.keys(target)) {
      pos[i * 3 + 0] += (target[i].x - base[i * 3 + 0]) * lerp * multiple
      pos[i * 3 + 1] += (target[i].y - base[i * 3 + 1]) * lerp * multiple
      pos[i * 3 + 2] += (target[i].z - base[i * 3 + 2]) * lerp * multiple
    }

    return pos
  }

  async COMPUTE_NOSE_MOVE_VERTICALLY (pos, gene, base, multiple = 1) { return pos }
  async COMPUTE_NOSE_MOVE_HORIZONTALLY (pos, gene, base, multiple = 1) { return pos }
  async COMPUTE_NOSE_MOVE_DEPTH (pos, gene, base, multiple = 1) { return pos }
  async COMPUTE_NOSE_SCALE_VERTICALLY (pos, gene, base, multiple = 1) { return pos }
  async COMPUTE_NOSE_SCALE_HORIZONTALLY (pos, gene, base, multiple = 1) { return pos }
  async COMPUTE_NOSE_SCALE_DEPTH (pos, gene, base, multiple = 1) { return pos }
  async COMPUTE_NOSE_SCALE_NOSTRILS_WIDTH (pos, gene, base, multiple = 1) { return pos }
  async COMPUTE_NOSE_TIP_WIDTH (pos, gene, base, multiple = 1) { return pos }
  async COMPUTE_NOSE_MOVE_BASE_VERTICALLY (pos, gene, base, multiple = 1) { return pos }
  async COMPUTE_NOSE_SCALE_WIDTH_0 (pos, gene, base, multiple = 1) { return pos }
  async COMPUTE_NOSE_SCALE_WIDTH_1 (pos, gene, base, multiple = 1) { return pos }
  async COMPUTE_NOSE_SCALE_WIDTH_2 (pos, gene, base, multiple = 1) { return pos }
  async COMPUTE_NOSE_COMPRESSION (pos, gene, base, multiple = 1) { return pos }
  async COMPUTE_NOSE_CURVE (pos, gene, base, multiple = 1) { return pos }
  async COMPUTE_NOSE_GREEK (pos, gene, base, multiple = 1) { return pos }
  async COMPUTE_NOSE_HUMP (pos, gene, base, multiple = 1) { return pos }
  async COMPUTE_NOSE_VOLUME (pos, gene, base, multiple = 1) { return pos }
  async COMPUTE_NOSE_NOSTRILS_ANGLE (pos, gene, base, multiple = 1) { return pos }
  async COMPUTE_NOSE_MOVE_TIP_VERTICALLY (pos, gene, base, multiple = 1) { return pos }
  async COMPUTE_NOSE_SEPTUM_ANGLE (pos, gene, base, multiple = 1) { return pos }
  async COMPUTE_NOSE_SCALE_NOSTRILS_FLARING (pos, gene, base, multiple = 1) { return pos }

  async COMPUTE_MOUSE_SCALE_VERTICALLY (pos, gene, base, multiple = 1) { return pos }
  async COMPUTE_MOUSE_SCALE_HORIZONTALLY (pos, gene, base, multiple = 1) { return pos }
  async COMPUTE_MOUSE_SCALE_DEPTH (pos, gene, base, multiple = 1) { return pos }
  async COMPUTE_MOUSE_MOVE_VERTICALLY (pos, gene, base, multiple = 1) { return pos }
  async COMPUTE_MOUSE_MOVE_HORIZONTALLY (pos, gene, base, multiple = 1) { return pos }
  async COMPUTE_MOUSE_MOVE_DEPTH (pos, gene, base, multiple = 1) { return pos }
  async COMPUTE_MOUSE_SCALE_LOWERLIP_HEIGHT (pos, gene, base, multiple = 1) { return pos }
  async COMPUTE_MOUSE_SCALE_LOWERLIP_WIDTH (pos, gene, base, multiple = 1) { return pos }
  async COMPUTE_MOUSE_SCALE_UPPERLIP_HEIGHT (pos, gene, base, multiple = 1) { return pos }
  async COMPUTE_MOUSE_SCALE_UPPERLIP_WIDTH (pos, gene, base, multiple = 1) { return pos }
  async COMPUTE_MOUSE_CUPIDS_BOW_WIDTH (pos, gene, base, multiple = 1) { return pos }
  async COMPUTE_MOUSE_DIMPLES (pos, gene, base, multiple = 1) { return pos }
  async COMPUTE_MOUSE_LAUGH_LINES (pos, gene, base, multiple = 1) { return pos }
}
