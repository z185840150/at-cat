import * as GUI from 'babylonjs-gui'
import Game from './../main' // eslint-disable-line no-unused-vars

import {Scene, SceneObject, SceneObjectAssets} from './../lib/@cat/index'

const [{Texture, ShaderMaterial}, {TextBlock}] = [BABYLON, BABYLON.GUI]

const FPS = 60

const PARTICLE_START_TIME = 500 // eslint-disable-line no-unused-vars
/** GUI 初始化延时，如果为 0 可能造成定位不准确。 */
const GUI_LABEL_READY_TIME = 50
/** 飞溅网格资源文件路径 */
const MESH_SPLASH_FILE_PATH = './static/assets/resources/'
/** 飞溅网格资源文件名称 */
const MESH_SPLASH_FILE_NAME = 'LoadingUI.babylon'
/** 飞溅网格资源文件网格名称 */
const MESH_SPLASH_ASSETS_NAME = 'plane'
/** GUI 入场透明度过渡时长 */
const GUI_BEGIN_FADE_IN_DURATION = 500
/** GUI 入场透明度过渡区间值 */
const GUI_BEGIN_FADE_IN_OPACITY_STEP = 1 / (GUI_BEGIN_FADE_IN_DURATION / 1000) * FPS / 1000
/** GUI 入场后静止时间 */
const GUI_BEGIN_WATTING_TIME = 1000

class SceneLoading extends Scene {
  get game () { return this._game }
  get guis () { return this._guis }
  /** 飞溅动画网格
   * @type {BABYLON.Mesh}
   */
  get splash () { return this._splash }
  /** 飞溅动画网格骨骼 */
  get splashSkeletons () { return this._splashSkeletons }
  /** 飞溅网格动画加载完毕
   * @type {boolean}
   */
  get splashIsReady () { return this._splashIsReady }
  /** 星空网格 */
  get star () { return this._star }
  /** 星空网格材质 */
  get starMaterial () { return this._starMaterial }
  /** 星空网格时间 */
  get starShaderTime () { return this._starShaderTime }
  /** 星空网格时钟 */
  get starShaderTimer () { return this._starShaderTimer }
  /** 星空运动速度 */
  get starSpeed () { return this._starSpeed }

  set game (val) { this._game = val }
  set guis (val) { this._guis = val }
  set splash (val) { this._splash = val }
  set splashSkeletons (val) { this._splashSkeletons = val }
  set splashIsReady (val) { this._splashIsReady = val }
  set star (val) { this._star = val }
  set starMaterial (val) { this._starMaterial = val }
  set starShaderTime (val) { this._starShaderTime = val }
  set starShaderTimer (val) { this._starShaderTimer = val }
  set starSpeed (val) { this._starSpeed = val }

  init () {
    this.guis = {}

    this.guis.advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI('Begin-Scene-GUI', true, this.game.scene)
    this.guis.advancedTexture.renderAtIdealSize = false

    // #region 初始化标签
    this.guis.textCompany = new BABYLON.GUI.TextBlock()
    this.guis.textCompany.fontFamily = 'Microsoft YaHei'
    this.guis.textCompany.fontSize = '32px'
    this.guis.textCompany.color = 'white'
    this.guis.textCompany.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT
    this.guis.textCompany.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP
    this.guis.textCompany.resizeToFit = true
    this.guis.textCompany.text = 'Parity Ltd. Present'
    this.guis.textCompany.alpha = 0

    this.guis.textBestOf = new BABYLON.GUI.TextBlock()
    this.guis.textBestOf.fontFamily = 'Microsoft YaHei'
    this.guis.textBestOf.resizeToFit = true
    this.guis.textBestOf.text = 'BEST OF 2018-2020'
    this.guis.textBestOf.fontSize = '14px'
    this.guis.textBestOf.color = 'white'
    this.guis.textBestOf.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT
    this.guis.textBestOf.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP
    this.guis.textBestOf.alpha = 0

    this.guis.textPowerBy = new BABYLON.GUI.TextBlock()
    this.guis.textPowerBy.fontFamily = 'Microsoft YaHei'
    this.guis.textPowerBy.resizeToFit = true
    this.guis.textPowerBy.text = '3D POWER BY BABYLON JS'
    this.guis.textPowerBy.fontSize = '16px'
    this.guis.textPowerBy.color = 'white'
    this.guis.textPowerBy.scaleY = 0.5
    this.guis.textPowerBy.scaleX = 0.5
    this.guis.textPowerBy.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT
    this.guis.textPowerBy.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP
    this.guis.textPowerBy.alpha = 0

    this.guis.advancedTexture.addControl(this.guis.textCompany)
    this.guis.advancedTexture.addControl(this.guis.textBestOf)
    this.guis.advancedTexture.addControl(this.guis.textPowerBy)
    // #endregion

    this.starMaterial = new BABYLON.ShaderMaterial('star-material', this.game.scene, {
      vertex: 'star',
      fragment: 'star'
    }, {
      attributes: ['position', 'uv'],
      uniforms: ['time', 'world', 'worldView', 'worldViewProjection', 'view', 'projection']
    })

    this.starMaterial.setTexture('textureSampler', new BABYLON.Texture('./static/assets/images/star.png', this.game.scene))

    // 初始化渲染管线
    this.game.pipeline.samples = 1 // 多采样抗锯齿 1~4 默认：1
    this.game.pipeline.fxaaEnabled = false // 快速抗锯齿，默认：false
    this.game.pipeline.imageProcessing.toneMappingEnabled = false // Tone Mapping, default false
    this.game.pipeline.imageProcessing.contrast = 1 // Camera contrast, range 1-4, default 1
    this.game.pipeline.imageProcessing.exposure = 1 // Camera exposure, range 1-4, default 1
    this.game.pipeline.bloomEnabled = false // Bloom, default false
  }

  GUI_MESH_SHOW (onMeshLoaded, onAnimationEnd) {
    BABYLON.SceneLoader
      .ImportMeshAsync('plane', './static/assets/resources/', 'LoadingUI.babylon', this.game.scene)
      .then(({meshes, skeletons}) => {
        onMeshLoaded()
        meshes[0].material.freeze()

        meshes[0].material.emissiveColor = new BABYLON.Color3(72 / 255, 145 / 255, 241 / 255)
        meshes[0].material.alphaMode = BABYLON.Engine.ALPHA_ADD

        setTimeout(() => {
          this.game.scene.beginAnimation(skeletons[0], 0, 26, false, 1, () => {
            meshes[0].dispose()
            onAnimationEnd()
          })
        }, 750)
      })
  }

  GUI_LOADING_MESSAGE_SHOW () {
    this._loadingText = new LoadingProgressText(this.game)
    this._loadingText.show('同步网络信息')
    setTimeout(() => {
      this._loadingText.show('基因模型重组')
    }, 1000)
  }

  PARTICLE_SHOW () {
    this._particleSys = new BABYLON.ParticleSystem('particles', 1000, this.game.scene)
    this._particleSys.particleTexture = new BABYLON.Texture('./static/assets/images/flare.png', this._scene)

    // Where the particles come from
    this._particleSys.emitter = new BABYLON.Vector3(0, 0, 0) // the starting object, the emitter
    this._particleSys.minEmitBox = new BABYLON.Vector3(-1, 0, 0) // Starting all from
    this._particleSys.maxEmitBox = new BABYLON.Vector3(1, 0, 0) // To...

    // Colors of all particles
    this._particleSys.color1 = new BABYLON.Color4(0.7, 0.8, 1.0, 1.0)
    this._particleSys.color2 = new BABYLON.Color4(0.2, 0.5, 1.0, 1.0)
    this._particleSys.colorDead = new BABYLON.Color4(0, 0, 0.2, 0.0)

    // Size of each particle (random between...
    this._particleSys.minSize = 0.1
    this._particleSys.maxSize = 1.0

    // Life time of each particle (random between...
    this._particleSys.minLifeTime = 0.3
    this._particleSys.maxLifeTime = 1.5
    // Emission rate
    this._particleSys.emitRate = 0

    // Blend mode : BLENDMODE_ONEONE, or BLENDMODE_STANDARD
    this._particleSys.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE

    // Set the gravity of all particles
    this._particleSys.gravity = new BABYLON.Vector3(0, 0, 0)

    // Direction of each particle after it has been emitted
    this._particleSys.direction1 = new BABYLON.Vector3(-5, -5, 2)
    this._particleSys.direction2 = new BABYLON.Vector3(5, 5, 6)

    // Angular speed, in radians
    this._particleSys.minAngularSpeed = 0
    this._particleSys.maxAngularSpeed = Math.PI

    // Speed
    this._particleSys.minEmitPower = 0.1
    this._particleSys.maxEmitPower = 10
    this._particleSys.updateSpeed = 0.01

    this._particleSys.start()

    let _keyEmitRate = [{frame: 0, value: 3000}, {frame: 48, value: 350}, {frame: 72, value: 150}]
    let _keyMinSize = [{frame: 0, value: 0.1}, {frame: 48, value: 0.6}]
    let _keyMaxSize = [{frame: 0, value: 0.1}, {frame: 48, value: 1.8}]
    let _keyMaxEmitPower = [{frame: 0, value: 20}, {frame: 48, value: 10}, {frame: 72, value: 1}]
    let _keyUpdateSpeed = [{frame: 24, value: 0.01}, {frame: 72, value: 0.005}]

    let _aniEmitRate = new BABYLON.Animation('animationEmitRate', 'emitRate', 24, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT)
    let _aniMinSize = new BABYLON.Animation('animationMinSize', 'minSize', 24, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT)
    let _aniMaxSize = new BABYLON.Animation('animationMaxSize', 'maxSize', 24, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT)
    let _aniMaxEmitPower = new BABYLON.Animation('animationMaxEmitPower', 'maxEmitPower', 24, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT)
    let _aniUpdateSpeed = new BABYLON.Animation('animationUpdateSpeed', 'updateSpeed', 24, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT)

    _aniEmitRate.setKeys(_keyEmitRate)
    _aniMinSize.setKeys(_keyMinSize)
    _aniMaxSize.setKeys(_keyMaxSize)
    _aniMaxEmitPower.setKeys(_keyMaxEmitPower)
    _aniUpdateSpeed.setKeys(_keyUpdateSpeed)

    this.game.scene.beginDirectAnimation(this._particleSys, [_aniEmitRate, _aniMinSize, _aniMaxSize, _aniMaxEmitPower, _aniUpdateSpeed], 0, 100)
    // setTimeout(() => {
    //   this._particleSys.emitRate = 100
    // }, 500)
  }

  _run () {
    const game = this.game
    const scene = game.scene

    /** 飞溅网格加载完毕回调函数，可能为空函数。
     * 当在GUI等待时间内加载完毕，如GUI等待时间已过尚未加载完毕，此方法会被复写为下文中 splashShow 方法
     */
    let splashReadyCallback = () => {}
    // 加载飞溅动画网格
    BABYLON.SceneLoader.ImportMeshAsync(
      MESH_SPLASH_ASSETS_NAME,
      MESH_SPLASH_FILE_PATH,
      MESH_SPLASH_FILE_NAME,
      scene)
      .then(({meshes, skeletons}) => {
        this.splash = meshes[0]
        this.splashSkeletons = skeletons[0]
        this.splash.visibility = 0

        this.splash.material.emissiveColor = new BABYLON.Color3(255 / 255, 145 / 255, 72 / 255)
        this.splash.material.alphaMode = BABYLON.Engine.ALPHA_ADD
        this.splashIsReady = true
        splashReadyCallback()
      })

    /** 飞溅网格显示并在一定延时开启动画和GUI移动至右下角 */
    const splashShow = () => {
      this.GUI_LABEL_MOVE_TO_END()
      this.splash.visibility = 1
      setTimeout(() => {
        setTimeout(() => { starShow() }, 900)
        scene.beginAnimation(this.splashSkeletons, 0, 26, false, 1, () => {
          // this.PARTICLE_SHOW()
          this.GUI_LOADING_MESSAGE_SHOW()
          this.splash.dispose()
        })
      }, 750)
    }
    /** 显示星空 */
    const starShow = () => {
      // 播放音频
      const soundOpt = {
        loop: true,
        autoplay: true,
        volume: 0
      }
      this.sound = new BABYLON.Sound('loading-sound', './static/assets/sounds/loading.mp3', scene, null, soundOpt)
      // 载入星空平面
      const options = {
        height: 10,
        width: 10,
        sideOrientation: BABYLON.Mesh.DOUBLESIDE
      }
      this.star = BABYLON.MeshBuilder.CreatePlane('star-plane', options, scene)
      this.star.visibility = 0
      this.star.material = this.starMaterial
      this.star.visibility = 1
      this.starSpeed = 0.05

      let speedKey = [{frame: 0, value: 0.05}, {frame: 30, value: 0.03}, {frame: 60, value: 0.01}]

      let aniSpeed = new BABYLON.Animation('star-speed-animation', 'starSpeed', 24, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT)

      aniSpeed.setKeys(speedKey)

      scene.beginDirectAnimation(this, [aniSpeed], 0, 60)

      this.starShaderTimer = setInterval(() => {
        this.starShaderTime += this.starSpeed
        this.starMaterial.setFloat('time', this.starShaderTime)
      }, 1000 / 60)
      /** 绑定重力加速度 */
      window.DeviceOrientationEvent && window.addEventListener('deviceorientation', e => {
        this.star.position = new BABYLON.Vector3(e.gamma / 90 * 2, e.beta / 180 * 2, 0)
      }, true)
    }

    // 开始
    setTimeout(() => {
      this.GUI_LABEL_REMOVE_TO_CENTER()
      let opacity = 0
      let opacityTimer = setInterval(() => {
        opacity += GUI_BEGIN_FADE_IN_OPACITY_STEP

        this.guis.textCompany.alpha = opacity
        this.guis.textBestOf.alpha = opacity
        this.guis.textPowerBy.alpha = opacity

        if (opacity >= 1) { // 如果透明度为1，入场结束
          setTimeout(() => { // 等待一定时间后准备显示飞溅网格
            if (this.splashIsReady) splashShow()
            else splashReadyCallback = () => { splashShow() }
          }, GUI_BEGIN_WATTING_TIME)
          window.clearInterval(opacityTimer) // 清理时钟
        }
      }, 1000 / FPS)
    }, GUI_LABEL_READY_TIME)
  }

  constructor (game) {
    super(game, 'scene house')
    this._game = game
    this._splashIsReady = false
    this._starShaderTime = 0
    this._starSpeed = 0.01

    this.GUI_BEGIN_ALPHA_CHANGE_TIME = 500
    this.GUI_MOVE_TO_RIGHT_BOTTOM_TIME = 1000
    this.GUI_MOVE_TO_RIGHT_BOTTOM_DELAY_TIME = 200
  }

  initOverride () {
    const [{game}, {scene}] = [this, this.game]
    this.guis = {}

    this.guis.advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI('Begin-Scene-GUI', true, scene)
    this.guis.advancedTexture.renderAtIdealSize = false

    // #region 初始化标签
    this.guis.textCompany = new TextBlock()
    this.guis.textCompany.fontFamily = 'Microsoft YaHei'
    this.guis.textCompany.fontSize = '32px'
    this.guis.textCompany.color = 'white'
    this.guis.textCompany.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT
    this.guis.textCompany.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP
    this.guis.textCompany.resizeToFit = true
    this.guis.textCompany.text = 'Parity Ltd. Present'
    this.guis.textCompany.alpha = 0

    this.guis.textBestOf = new TextBlock()
    this.guis.textBestOf.fontFamily = 'Microsoft YaHei'
    this.guis.textBestOf.resizeToFit = true
    this.guis.textBestOf.text = 'BEST OF 2018-2020'
    this.guis.textBestOf.fontSize = '14px'
    this.guis.textBestOf.color = 'white'
    this.guis.textBestOf.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT
    this.guis.textBestOf.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP
    this.guis.textBestOf.alpha = 0

    this.guis.textPowerBy = new TextBlock()
    this.guis.textPowerBy.fontFamily = 'Microsoft YaHei'
    this.guis.textPowerBy.resizeToFit = true
    this.guis.textPowerBy.text = 'POWER BY BABYLON JS'
    this.guis.textPowerBy.fontSize = '16px'
    this.guis.textPowerBy.color = 'white'
    this.guis.textPowerBy.scaleY = 0.5
    this.guis.textPowerBy.scaleX = 0.5
    this.guis.textPowerBy.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT
    this.guis.textPowerBy.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP
    this.guis.textPowerBy.alpha = 0

    this.guis.advancedTexture.addControl(this.guis.textCompany)
    this.guis.advancedTexture.addControl(this.guis.textBestOf)
    this.guis.advancedTexture.addControl(this.guis.textPowerBy)
    // #endregion

    // 初始化渲染管线
    game.pipeline.samples = 1 // 多采样抗锯齿 1~4 默认：1
    game.pipeline.fxaaEnabled = false // 快速抗锯齿，默认：false
    game.pipeline.imageProcessing.toneMappingEnabled = false // Tone Mapping, default false
    game.pipeline.imageProcessing.contrast = 1 // Camera contrast, range 1-4, default 1
    game.pipeline.imageProcessing.exposure = 1 // Camera exposure, range 1-4, default 1
    game.pipeline.bloomEnabled = false // Bloom, default false

    // 星空材质
    this.starMaterial = new ShaderMaterial('star-material',
      scene, { vertex: 'star', fragment: 'star' }, { attributes: ['position', 'uv'],
        uniforms: ['time', 'world', 'worldView', 'worldViewProjection', 'view', 'projection']
      })

    this.starMaterial.setTexture('textureSampler', new Texture('./static/assets/images/star.png', scene))
  }

  initOutlineOverride () {
    this.outline.set('splash',
      new SceneObject(this.game, 'house',
        new SceneObjectAssets('./static/assets/resources/', 'LoadingUI.babylon', 'plane', [])))
  }

  run () {
    setTimeout(() => { // GUI 初始化延时，如果为 0 或直接运行可能造成定位不准确。
      this.__guiTextRemoveCenter() // 移动所有的 GUI 到屏幕中心
      let opacity = 0
      let opacityTimer = setInterval(() => {
        opacity += GUI_BEGIN_FADE_IN_OPACITY_STEP

        this.guis.textCompany.alpha = opacity
        this.guis.textBestOf.alpha = opacity
        this.guis.textPowerBy.alpha = opacity

        if (opacity >= 1) { // 如果透明度为1，入场结束
          // 等待一定时间后显示飞溅网格 GUI_BEGIN_WATTING_TIME
          setTimeout(() => this.__splashMeshShow(), GUI_BEGIN_WATTING_TIME)
          window.clearInterval(opacityTimer) // 清理时钟
        }
      }, 1000 / FPS)
    }, 50)
  }

  // custom method
  /**
   * GUI 移动至屏幕中心
   *
   * @memberof SceneLoading
   */
  __guiTextRemoveCenter () {
    const [{canvas}, {textCompany, textBestOf, textPowerBy}] = [this.game, this.guis]

    textCompany.left = (canvas.width - textCompany._width.internalValue) / 2 + 'px'
    textCompany.top = (canvas.height - textCompany._height.internalValue) / 2 + 'px'
    textBestOf.left = (canvas.width - textBestOf._width.internalValue) / 2 + 'px'
    textBestOf.top = textCompany._top.internalValue + textCompany._height.internalValue + 0 + 'px'
    textPowerBy.left = (canvas.width - textPowerBy._width.internalValue) / 2 + 'px'
    textPowerBy.top = textBestOf._top.internalValue + textBestOf._height.internalValue / 2 + 0 + 'px'
  }
  /**
   * GUI 移动至屏幕右下角
   *
   * @memberof SceneLoading
   */
  __guiTextRemoveToScreenRB () {
    const duration = this.GUI_MOVE_TO_RIGHT_BOTTOM_TIME

    const t0 = FPS * this.GUI_MOVE_TO_RIGHT_BOTTOM_TIME / 1000
    const t1 = FPS * (this.GUI_MOVE_TO_RIGHT_BOTTOM_TIME - this.GUI_MOVE_TO_RIGHT_BOTTOM_DELAY_TIME) / 1000
    const t2 = FPS * (this.GUI_MOVE_TO_RIGHT_BOTTOM_TIME - this.GUI_MOVE_TO_RIGHT_BOTTOM_DELAY_TIME * 2) / 1000

    const w = this.game._canvas.width
    const h = this.game._canvas.height

    const ui = this.guis

    const tb0 = {
      x: ((w - ui.textCompany._width.internalValue) - ui.textCompany._left.internalValue) / t0,
      y: ((h - ui.textCompany._height.internalValue) - ui.textCompany._top.internalValue) / t0
    }
    const tb1 = {
      x: ((w - ui.textBestOf._width.internalValue) - ui.textBestOf._left.internalValue) / t1,
      y: ((h - ui.textBestOf._height.internalValue - ui.textCompany._height.internalValue) - ui.textBestOf._top.internalValue) / t1
    }
    const tb2 = {
      x: ((w - ui.textPowerBy._width.internalValue + ui.textPowerBy._width.internalValue / 4) - ui.textPowerBy._left.internalValue) / t2,
      y: ((h - ui.textPowerBy._height.internalValue + ui.textPowerBy._height.internalValue / 4) - ui.textCompany._height.internalValue - ui.textBestOf._height.internalValue - ui.textPowerBy._top.internalValue) / t2
    }

    let timed = 0

    let timer = setInterval(() => {
      timed += 1000 / FPS

      if (timed > 0 && timed < duration) ui.textCompany.left = ui.textCompany._left.internalValue + tb0.x + 'px'
      if (timed > this.GUI_MOVE_TO_RIGHT_BOTTOM_DELAY_TIME && timed < duration) ui.textBestOf.left = ui.textBestOf._left.internalValue + tb1.x + 'px'
      if (timed > this.GUI_MOVE_TO_RIGHT_BOTTOM_DELAY_TIME * 2 && timed < duration) ui.textPowerBy.left = ui.textPowerBy._left.internalValue + tb2.x + 'px'

      if (timed > 0 && timed < duration) ui.textCompany.top = ui.textCompany._top.internalValue + tb0.y + 'px'
      if (timed > this.GUI_MOVE_TO_RIGHT_BOTTOM_DELAY_TIME && timed < duration) ui.textBestOf.top = ui.textBestOf._top.internalValue + tb1.y + 'px'
      if (timed > this.GUI_MOVE_TO_RIGHT_BOTTOM_DELAY_TIME * 2 && timed < duration) ui.textPowerBy.top = ui.textPowerBy._top.internalValue + tb2.y + 'px'

      timed >= duration && window.clearInterval(timer)
    }, 1000 / FPS)
  }
  __splashMeshShow () {

  }
}

class LoadingProgressText {
  constructor (game) {
    this.game = game

    this._text = ''
    this._textCache = ''

    this._rotateCursors = '｜／－＼'.split('')
    this._rotateCursorsIndex = 0

    this._errorCharas = '箌淐喢鞞鴔燖鸎曖抧郂見锏饝婥繌鎅刉鄮@€О繞聽><?*&%:;{}[]()+#ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890'.split('')
    this._errorCharaTime = 0

    this._TIMER = null
    this.INIT_TEXTBLOCK()
  }
  INIT_TEXTBLOCK () {
    this.advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI('ui2', true, this.game.scene)

    this._textBlock = new BABYLON.GUI.TextBlock()
    this._textBlock.fontFamily = 'Microsoft YaHei'
    this._textBlock.fontSize = '14px'
    this._textBlock.color = 'white'
    this._textBlock.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT
    this._textBlock.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP
    this._textBlock.resizeToFit = true
    this._textBlock.text = ''
    this._textBlock.alpha = 1
    this._textBlock.left = '14px'
    this._textBlock.top = '28px'
    this.advancedTexture.addControl(this._textBlock)
  }

  show (text) {
    if (this._text !== text) {
      this._text = text
      this._rotateCursorsIndex = 0

      this._TIMER && clearInterval(this._TIMER)

      this._TIMER = setInterval(() => {
        if (this._textCache === '' || this._textCache === this._text.substring(0, this._textCache.length - 1)) { // 如果文字已经清空 或残留文字等同于新文字
          clearInterval(this._TIMER)
          this._TIMER = setInterval(() => {
            if (this._textCache === this._text) {
              clearInterval(this._TIMER)
              this._TIMER = setInterval(() => {
                this._rotateCursorsIndex = this._rotateCursorsIndex === 3 ? 0 : this._rotateCursorsIndex + 1
                this._textBlock.text = `[ ${this._textCache} ... ${this._rotateCursors[this._rotateCursorsIndex]} ]`
              }, 500)
            } else {
              if (this._errorCharaTime === 3) {
                this._errorCharaTime = 0
                this._textCache = this._text.substring(0, this._textCache.length + 1)
                this._textBlock.text = `[ ${this._textCache}| ]`
              } else {
                this._errorCharaTime++
                this._textBlock.text = `[ ${this._textCache}${this._errorCharas[Math.ceil(Math.random() * this._errorCharas.length) - 1]}| ]`
              }
            }
          }, 12)
        } else {
          this._textCache = this._textCache.substring(0, this._textCache.length - 1)
          this._textBlock.text = `[ ${this._textCache}| ]`
        }
      }, 24)
    }
  }
}

export default SceneLoading
