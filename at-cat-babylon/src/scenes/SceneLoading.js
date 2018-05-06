import * as GUI from 'babylonjs-gui'

class SceneLoading {
  constructor (game) {
    this._game = game

    this.FPS = 60
    this.GUI_LABEL_READY_TIME = 50
    this.GUI_BEGIN_ALPHA_CHANGE_TIME = 500
    this.GUI_SHOW_WAITING_TIME = 1000
    this.GUI_MOVE_TO_RIGHT_BOTTOM_TIME = 1000
    this.GUI_MOVE_TO_RIGHT_BOTTOM_DELAY_TIME = 200
    this.PARTICLE_START_TIME = 500

    this.init()
  }

  init () {
    this._gui = {}
    this._gui._advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI('Begin-Scene-GUI', true, this._game._scene)

    this._gui._advancedTexture.renderAtIdealSize = false

    return this.initLabel()
  }

  initLabel () {
    this._gui._textCompany = new BABYLON.GUI.TextBlock()
    this._gui._textCompany.fontFamily = 'Microsoft YaHei'
    this._gui._textCompany.fontSize = '32px'
    this._gui._textCompany.color = 'white'
    this._gui._textCompany.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT
    this._gui._textCompany.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP
    this._gui._textCompany.resizeToFit = true
    this._gui._textCompany.text = 'Parity Ltd. Present'
    this._gui._textCompany.alpha = 0

    this._gui._textBestOf = new BABYLON.GUI.TextBlock()
    this._gui._textBestOf.fontFamily = 'Microsoft YaHei'
    this._gui._textBestOf.resizeToFit = true
    this._gui._textBestOf.text = 'BEST OF 2018-2020'
    this._gui._textBestOf.fontSize = '14px'
    this._gui._textBestOf.color = 'white'
    this._gui._textBestOf.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT
    this._gui._textBestOf.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP
    this._gui._textBestOf.alpha = 0

    this._gui._textPowerBy = new BABYLON.GUI.TextBlock()
    this._gui._textPowerBy.fontFamily = 'Microsoft YaHei'
    this._gui._textPowerBy.resizeToFit = true
    this._gui._textPowerBy.text = '3D POWER BY BABYLON JS'
    this._gui._textPowerBy.fontSize = '16px'
    this._gui._textPowerBy.color = 'white'
    this._gui._textPowerBy.scaleY = 0.5
    this._gui._textPowerBy.scaleX = 0.5
    this._gui._textPowerBy.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT
    this._gui._textPowerBy.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP
    this._gui._textPowerBy.alpha = 0

    this._gui._advancedTexture.addControl(this._gui._textCompany)
    this._gui._advancedTexture.addControl(this._gui._textBestOf)
    this._gui._advancedTexture.addControl(this._gui._textPowerBy)
  }

  GUI_LABEL_REMOVE_TO_CENTER () {
    this._gui._textCompany.left = (this._game._canvas.width - this._gui._textCompany._width.internalValue) / 2 + 'px'
    this._gui._textCompany.top = (this._game._canvas.height - this._gui._textCompany._height.internalValue) / 2 + 'px'
    this._gui._textBestOf.left = (this._game._canvas.width - this._gui._textBestOf._width.internalValue) / 2 + 'px'
    this._gui._textBestOf.top = this._gui._textCompany._top.internalValue + this._gui._textCompany._height.internalValue + 0 + 'px'
    this._gui._textPowerBy.left = (this._game._canvas.width - this._gui._textPowerBy._width.internalValue) / 2 + 'px'
    this._gui._textPowerBy.top = this._gui._textBestOf._top.internalValue + this._gui._textBestOf._height.internalValue / 2 + 0 + 'px'
  }

  GUI_LABEL_MOVE_TO_END () {
    const duration = this.GUI_MOVE_TO_RIGHT_BOTTOM_TIME

    const t0 = this.FPS * this.GUI_MOVE_TO_RIGHT_BOTTOM_TIME / 1000
    const t1 = this.FPS * (this.GUI_MOVE_TO_RIGHT_BOTTOM_TIME - this.GUI_MOVE_TO_RIGHT_BOTTOM_DELAY_TIME) / 1000
    const t2 = this.FPS * (this.GUI_MOVE_TO_RIGHT_BOTTOM_TIME - this.GUI_MOVE_TO_RIGHT_BOTTOM_DELAY_TIME * 2) / 1000

    const w = this._game._canvas.width
    const h = this._game._canvas.height

    const ui = this._gui

    const tb0 = {
      x: ((w - ui._textCompany._width.internalValue) - ui._textCompany._left.internalValue) / t0,
      y: ((h - ui._textCompany._height.internalValue) - ui._textCompany._top.internalValue) / t0
    }
    const tb1 = {
      x: ((w - ui._textBestOf._width.internalValue) - ui._textBestOf._left.internalValue) / t1,
      y: ((h - ui._textBestOf._height.internalValue - ui._textCompany._height.internalValue) - ui._textBestOf._top.internalValue) / t1
    }
    const tb2 = {
      x: ((w - ui._textPowerBy._width.internalValue + ui._textPowerBy._width.internalValue / 4) - ui._textPowerBy._left.internalValue) / t2,
      y: ((h - ui._textPowerBy._height.internalValue + ui._textPowerBy._height.internalValue / 4) - ui._textCompany._height.internalValue - ui._textBestOf._height.internalValue - ui._textPowerBy._top.internalValue) / t2
    }

    let timed = 0

    let timer = setInterval(() => {
      timed += 1000 / this.FPS

      if (timed > 0 && timed < duration) ui._textCompany.left = ui._textCompany._left.internalValue + tb0.x + 'px'
      if (timed > this.GUI_MOVE_TO_RIGHT_BOTTOM_DELAY_TIME && timed < duration) ui._textBestOf.left = ui._textBestOf._left.internalValue + tb1.x + 'px'
      if (timed > this.GUI_MOVE_TO_RIGHT_BOTTOM_DELAY_TIME * 2 && timed < duration) ui._textPowerBy.left = ui._textPowerBy._left.internalValue + tb2.x + 'px'

      if (timed > 0 && timed < duration) ui._textCompany.top = ui._textCompany._top.internalValue + tb0.y + 'px'
      if (timed > this.GUI_MOVE_TO_RIGHT_BOTTOM_DELAY_TIME && timed < duration) ui._textBestOf.top = ui._textBestOf._top.internalValue + tb1.y + 'px'
      if (timed > this.GUI_MOVE_TO_RIGHT_BOTTOM_DELAY_TIME * 2 && timed < duration) ui._textPowerBy.top = ui._textPowerBy._top.internalValue + tb2.y + 'px'

      timed >= duration && window.clearInterval(timer)
    }, 1000 / this.FPS)
  }

  GUI_MESH_SHOW (onMeshLoaded, onAnimationEnd) {
    BABYLON.SceneLoader
      .ImportMeshAsync('plane', './static/assets/resources/', 'LoadingUI.babylon', this._game._scene)
      .then(({meshes, skeletons}) => {
        onMeshLoaded()
        meshes[0].material.freeze()

        meshes[0].material.emissiveColor = new BABYLON.Color3(72 / 255, 145 / 255, 241 / 255)
        meshes[0].material.alphaMode = BABYLON.Engine.ALPHA_ADD

        setTimeout(() => {
          this._game._scene.beginAnimation(skeletons[0], 0, 26, false, 1, () => {
            meshes[0].dispose()
            onAnimationEnd()
          })
        }, 750)
      })
  }

  GUI_LOADING_MESSAGE_SHOW () {
    this._loadingText = new LoadingProgressText(this._game)
    this._loadingText.show('同步网络信息')
    setTimeout(() => {
      this._loadingText.show('基因模型重组')
    }, 1000)
  }

  PARTICLE_SHOW () {
    this._particleSys = new BABYLON.ParticleSystem('particles', 1000, this._game._scene)
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

    this._game._scene.beginDirectAnimation(this._particleSys, [_aniEmitRate, _aniMinSize, _aniMaxSize, _aniMaxEmitPower, _aniUpdateSpeed], 0, 100)
    // setTimeout(() => {
    //   this._particleSys.emitRate = 100
    // }, 500)
  }

  start () {
    let ALPHA_STEP = 1 / (this.GUI_BEGIN_ALPHA_CHANGE_TIME / 1000) * this.FPS / 1000
    setTimeout(() => {
      this.GUI_LABEL_REMOVE_TO_CENTER()
      let TEMP_ALPHA = 0
      let ALPHA_TIMER = setInterval(() => {
        TEMP_ALPHA = TEMP_ALPHA + ALPHA_STEP

        this._gui._textCompany.alpha = TEMP_ALPHA
        this._gui._textBestOf.alpha = TEMP_ALPHA
        this._gui._textPowerBy.alpha = TEMP_ALPHA

        TEMP_ALPHA >= 1 && setTimeout(() => {
          this.GUI_MESH_SHOW(() => {
            this.GUI_LABEL_MOVE_TO_END()
          }, () => {
            this.PARTICLE_SHOW()
            this.GUI_LOADING_MESSAGE_SHOW()
          })
        }, this.GUI_SHOW_WAITING_TIME) && window.clearInterval(ALPHA_TIMER)
      }, 1000 / this.FPS)
    }, this.GUI_LABEL_READY_TIME)
  }
}

class LoadingProgressText {
  constructor (game) {
    this._game = game

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
    this._advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI('ui2', true, this._game._scene)

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
    this._advancedTexture.addControl(this._textBlock)
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
