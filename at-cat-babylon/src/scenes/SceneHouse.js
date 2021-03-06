import * as BABYLON from 'babylonjs'
import CatMaker from './../lib/cat-maker'
import TargetMaker from './../lib/cat-maker/src/target-maker'
import Gene from './../lib/cat-gene'

import {Scene, SceneObject, SceneObjectAssets, Outline} from './../lib/@cat/index' // eslint-disable-line

const MAKE_TARGET = false
const MESH_NAMES = [
  'cat_body',
  'body-fat-max', 'body-fat-min'
  // 'head-angle-max', 'head-angle-min',
  // 'forehead-bulge-max', 'forehead-bulge-min'
]

class SceneHouse extends Scene {
  constructor (game) {
    super(game, 'scene house')
  }

  initAfter () {
    // const game = this.game
    // // 初始化场景
    // game.scene.ambientColor = new BABYLON.Color3(1, 1, 1)
    // // 初始化摄像机
    // game.camera.position = new BABYLON.Vector3(50, 10, 50)
    // game.camera.speed /= 1
    // game.camera.setTarget(BABYLON.Vector3.Zero())

    // // 初始化灯光
    // game.light.dispose()
    // game.light = new BABYLON.DirectionalLight('light default', new BABYLON.Vector3(-1, -2, 1), game.scene)
    // game.light.intensity = 1
    // game.light.position = new BABYLON.Vector3(20, 40, -20)

    // // 初始化灯光阴影发生器
    // game.shadowGenerator = new BABYLON.ShadowGenerator(1024, game.light)
    // game.shadowGenerator.usePoissonSampling = true
    // game.shadowGenerator.useExponentialShadowMap = true // Exponential shadow map
    // game.shadowGenerator.useBlurExponentialShadowMap = true
    // game.shadowGenerator.useCloseExponentialShadowMap = true

    // game.shadowGenerator.useBlurCloseExponentialShadowMap = true
    // game.shadowGenerator.usePercentageCloserFiltering = true // Percentage Closer Filtering
    // game.shadowGenerator.filteringQuality = BABYLON.ShadowGenerator.QUALITY_LOW
    // game.shadowGenerator.useContactHardeningShadow = true // Contact hardening shadow (Webgl2 only)
    // game.shadowGenerator.forceBackFacesOnly = true
    // game.shadowGenerator.useKernelBlur = true
    // game.shadowGenerator.blurKernel = 32

    // game.skybox && game.skybox.dispose()
    // game.skybox = null
    // game.skybox = game.scene.createDefaultSkybox(BABYLON.CubeTexture
    //   .CreateFromPrefilteredData('./static/assets/resources/hdri/skybox.dds', game.scene), true, 1000, 0, true)
    // game.skybox.name = 'skybox default'
  }

  initOutLine () {
    this.outline.set('house', new SceneObject(this.game, 'house', new SceneObjectAssets(
      './static/assets/resources/house/', 'house.gltf', '__root__',
      [ 'house_mesh', 'house_pillar_mesh', 'house_planks_mesh', 'house_frame_mesh',
        'house_carpet_mesh', 'house_bowl_water_mesh', 'house_floor_mesh',
        'house_board_mesh', 'house_bowl_food_mesh' ])))
  }

  run () {
    if (MAKE_TARGET) return this.computeTarget('body-fat-min')

    const game = this.game
    const scene = game.scene

    game.skybox && game.skybox.dispose()
    game.skybox = null
    game.skybox = scene.createDefaultSkybox(BABYLON.CubeTexture.CreateFromPrefilteredData('./static/assets/resources/hdri/skybox.dds', scene), true, 1000, 0, true)
    game.skybox.name = 'skybox default'

    game.camera.position = new BABYLON.Vector3.Zero()

    scene.shadowsEnabled = true

    // this.game.light.shadowMinZ = 10
    // this.game.light.shadowMaxZ = 70

    this.outline.forEach((obj, key) => {
      obj.display = true
    })
    this.outline.get('house').root.position = new BABYLON.Vector3(0, 5, -90)
    this.game.cat.meshs.cat.position = new BABYLON.Vector3(0, 0, 0)
    this.game.cat.meshs.cat.visibility = 1
    this.game.scene.beginWeightedAnimation(this.game.cat.meshs['cat_body'].skeleton, 20, 150, 1, true, 1)
    this.game.cat.meshs.cat.scaling = new BABYLON.Vector3(0.8, 0.8, 0.8)
    this.game.cat.meshs.cat.position = new BABYLON.Vector3(8, -5.1, -120)

    this.game.scene.getMeshByName('star-plane').dispose()

    window.DeviceOrientationEvent && window.addEventListener('deviceorientation', e => {
      this.game.camera.setTarget(new BABYLON.Vector3(e.gamma / 90 * 1.5, e.beta / 180 * 1.5, 0))
    }, true)

    this.game.camera.dispose()
    this.game.camera = new BABYLON.FreeCamera('Default-Camera', new BABYLON.Vector3(0, 0, 10), this.game.scene)
    this.game.camera.setTarget(BABYLON.Vector3.Zero())
    this.game.camera.attachControl(this.game.canvas, true)
    this.game.camera.speed /= 2
    this.game.camera.position = new BABYLON.Vector3(25.42340477183468, -10.578907490856313, -72.63163384247723)

    // this.game.camera.dispose()
    // this.game.camera = new BABYLON.DeviceOrientationCamera('Default-Camera', new BABYLON.Vector3(0, 0, 10), this.game.scene)
    // this.game.camera.setTarget(BABYLON.Vector3.Zero())
    // this.game.camera.angularSensibility = 10000000
    // this.game.camera.moveSensibility = 10000000
    // this.game.camera.attachControl(this.game.canvas, true)

    this.game.pipeline = new BABYLON.DefaultRenderingPipeline('DEFAULT_PIPELINE', true, this.game.scene, [this.game.camera], true)

    this.game.pipeline.samples = 1 // 多采样抗锯齿 1~4 默认：1
    this.game.pipeline.fxaaEnabled = false // 快速抗锯齿，默认：false
    this.game.pipeline.imageProcessing.toneMappingEnabled = false // Tone Mapping, default false
    this.game.pipeline.imageProcessing.contrast = 1 // Camera contrast, range 1-4, default 1
    this.game.pipeline.imageProcessing.exposure = 1 // Camera exposure, range 1-4, default 1
    this.game.pipeline.bloomEnabled = true // Bloom, default false
    this.game.pipeline.bloomKernel = 60 // Kernel, range 1-500, default 64
    this.game.pipeline.bloomWeight = 0.5 // Weight
    this.game.pipeline.bloomThreshold = 0.70 // Threshold
    this.game.pipeline.bloomScale = 0.25 // Scale

    console.log(this.game.shadowGenerator.getShadowMap())
    // let tasks = {}
    // let targets = {}
    // let names = ['body-fat-max']

    // names.map((name, i) => {
    //   tasks[name] = assetsManager.addTextFileTask(name, `./static/assets/resources/cat/target/${name}.target`)
    //   tasks[name].onSuccess = task => {
    //     targets[name] = {}
    //     task.text.split('\n').map((line, i) => {
    //       let arr = line.split(' ')
    //       targets[name][Number(arr[0])] = [Number(arr[1]), Number(arr[2]), Number(arr[3])]
    //     })
    //   }
    // })

    // assetsManager.load()
    // assetsManager.onTaskSuccessObservable.add(task => {})
    // assetsManager.onTasksDoneObservable.add(tasks => {
    //   console.log(targets)
    //   this.loadSkyBox()
    //     .then(() => BABYLON.SceneLoader.ImportMeshAsync('cat_body', './static/assets/resources/cat/babylon/', 'cat-target.babylon', scene))
    //     .then(({meshes, skeletons}) => {
    //       let mesh = meshes[0]
    //       mesh.clone('dsa')
    //       let skeleton = skeletons[0]

    //       let positions = mesh.getVerticesData(BABYLON.VertexBuffer.PositionKind)

    //       for (let t in targets['body-fat-max']) {
    //         positions[t * 3] += (targets['body-fat-max'][t][0] - positions[t * 3]) * 1
    //         positions[t * 3 + 1] += (targets['body-fat-max'][t][1] - positions[t * 3 + 1]) * 1
    //         positions[t * 3 + 2] += (targets['body-fat-max'][t][2] - positions[t * 3 + 2]) * 1
    //       }

    //       mesh.setVerticesData(BABYLON.VertexBuffer.PositionKind, positions)

    //       skeleton.createAnimationRange('blink', 1, 8)
    //       skeleton.createAnimationRange('blink double', 8, 20)
    //       skeleton.createAnimationRange('breathe', 20, 150)
    //       skeleton.createAnimationRange('tail', 151, 191)

    //       let blinkRange = skeleton.getAnimationRange('blink')
    //       let blinkDoubleRange = skeleton.getAnimationRange('blink double')
    //       let breatheRange = skeleton.getAnimationRange('breathe')
    //       let tailRange = skeleton.getAnimationRange('tail')

    //       let breatheAnim = scene.beginWeightedAnimation(skeleton, breatheRange.from, breatheRange.to, 1, true, 1)
    //     })
    // })

    /*
    this.loadSkyBox()
      .then(({meshes, skeletons}) => {
        let mesh = meshes[0]
        let skeleton = skeletons[0]

        let positions = mesh.getVerticesData(BABYLON.VertexBuffer.PositionKind)
        let uv = mesh.getVerticesData(BABYLON.VertexBuffer.UVKind)
        // console.log(mesh.getIndices())

        skeleton.animationPropertiesOverride = new BABYLON.AnimationPropertiesOverride()
        skeleton.animationPropertiesOverride.enableBlending = true
        skeleton.animationPropertiesOverride.blendingSpeed = 0.05
        skeleton.animationPropertiesOverride.loopMode = 1

        skeleton.createAnimationRange('blink', 1, 8)
        skeleton.createAnimationRange('blink double', 8, 20)
        skeleton.createAnimationRange('breathe', 20, 150)
        skeleton.createAnimationRange('tail', 151, 191)

        let blinkRange = skeleton.getAnimationRange('blink')
        let blinkDoubleRange = skeleton.getAnimationRange('blink double')
        let breatheRange = skeleton.getAnimationRange('breathe')
        let tailRange = skeleton.getAnimationRange('tail')

        scene.stopAnimation(skeleton)

        let breatheAnim = scene.beginWeightedAnimation(skeleton, breatheRange.from, breatheRange.to, 1, true, 1)
        let tailAnim = scene.beginWeightedAnimation(skeleton, tailRange.from, tailRange.to, 1, true, 1)

        // breatheAnim.syncWith(null)

        // const blinkAnimation = () => {
        //   let blinkAnim = scene.beginWeightedAnimation(skeleton, blinkRange.from, blinkRange.to, 1, false, 1, () => {
        //     blinkAnim.syncWith(breatheAnim)
        //     setTimeout(() => { blinkAnimation() }, Math.random() * 1000 + 1000)
        //   })
        // }

        // blinkAnimation()
      })

    /* .then(() => BABYLON.SceneLoader.AppendAsync('./static/assets/resources/cat/', 'cat.obj', scene))
      .then(scene => {
        game.camera.setTarget(BABYLON.Vector3.Zero())

        game.camera.position.y = 15

        let body = scene.getMeshByName('cat_body')

        let furMaterial = new BABYLON.FurMaterial('fur', scene)
        furMaterial.furLength = 0
        furMaterial.furAngle = 0
        furMaterial.furColor = new BABYLON.Color3(1, 1, 1)
        furMaterial.diffuseTexture = new BABYLON.Texture('./static/assets/resources/cat/m_cat_body_pbr_mr_baseColor.jpg', scene)
        furMaterial.furTexture = BABYLON.FurMaterial.GenerateTexture('furTexture', scene)
        furMaterial.heightTexture = new BABYLON.Texture('./static/assets/resources/cat/m_cat_body_fur_mask.png', scene)
        furMaterial.furSpacing = 0.4
        furMaterial.furDensity = 80
        furMaterial.furSpeed = 10000
        furMaterial.furGravity = new BABYLON.Vector3(0, -1, 0)

        body.material = furMaterial

        let sphere = BABYLON.Mesh.CreateSphere('sphere 2', 48, 30, scene)

        sphere.position = new BABYLON.Vector3(50, 0, 0)

        sphere.material = furMaterial

        const quality = 30

        let shells = BABYLON.FurMaterial.FurifyMesh(body, quality)
        BABYLON.FurMaterial.FurifyMesh(sphere, quality)

        for (var i = 0; i < shells.length; i++) {
          shells[i].material.backFaceCulling = false
        }
      }) */
    /*
    BABYLON.SceneLoader
      .AppendAsync(_path, _name, this.game.scene)
      .then(() => BABYLON.SceneLoader.AppendAsync)
      .then(append => append(_path2, 'cat.gltf', this.game.scene))
      .then(scene => {
        scene.shadowsEnabled = true

        this.game.light.shadowMinZ = 10
        this.game.light.shadowMaxZ = 70

        'pillar,planks,frame,carpet,bowl_water,floor,board,bowl_food'.split(',').map((n, i) => {
          let mesh = scene.getMeshByName(`house_${n}_mesh`)
          mesh.receiveShadows = true
          this.game.shadowGenerator.getShadowMap().renderList.push(mesh)
        })

        // let catMesh = this.game.scene.getMeshByName('cat_body cat')

        // let furMaterial = new BABYLON.FurMaterial('fur_material', this.game.scene)

        // furMaterial.furLength = 0.25
        // furMaterial.furAngle = 0
        // furMaterial.furColor = new BABYLON.Color3(1, 1, 1)
        // furMaterial.diffuseTexture = new BABYLON.Texture('./static/assets/resources/cat/m_cat_body_pbr_mr_baseColor.jpg', this.game.scene)
        // furMaterial.furTexture = BABYLON.FurMaterial.GenerateTexture('./static/assets/resources/cat/m_cat_body_pbr_mr_baseColor.jpg', this.game.scene)
        // furMaterial.furSpacing = 2
        // furMaterial.furDensity = 20
        // furMaterial.furSpeed = 100
        // furMaterial.furGravity = new BABYLON.Vector3(0, -1, 0)

        // // let furTexture = BABYLON.FurMaterial.GenerateTexture('./static/assets/resources/cat/fur.jpg', this.game.scene)
        // // furMaterial.furTexture = furTexture

        // catMesh.material = furMaterial

        // BABYLON.FurMaterial.FurifyMesh(catMesh, 30)

        // console.log(catMesh)
      })
      .then(() => { this.DEBUG && this.debug() })
      */
  }

  debug () {
    const game = this.game
    const scene = game.scene
    const shadowGenerator = game.shadowGenerator

    let advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI('UI')
    let panel = this.debugPanel()

    advancedTexture.addControl(panel)

    panel.addControl(this.debugChkBox('Shadow Enable', val => {
      scene.shadowsEnabled = !scene.shadowsEnabled
    }, scene.shadowsEnabled))
    panel.addControl(this.debugChkBox('Use Poisson Sampling', val => {
      shadowGenerator.usePoissonSampling = !shadowGenerator.usePoissonSampling
    }, shadowGenerator.usePoissonSampling))
    panel.addControl(this.debugChkBox('Use Exponential Shadow Map', val => {
      shadowGenerator.useExponentialShadowMap = !shadowGenerator.useExponentialShadowMap
    }, shadowGenerator.useExponentialShadowMap))
    panel.addControl(this.debugChkBox('Use Blur Exponential Shadow Map', val => {
      shadowGenerator.useBlurExponentialShadowMap = !shadowGenerator.useBlurExponentialShadowMap
    }, shadowGenerator.useBlurExponentialShadowMap))
    panel.addControl(this.debugChkBox('Use Close Exponential Shadow Map', val => {
      shadowGenerator.useCloseExponentialShadowMap = !shadowGenerator.useCloseExponentialShadowMap
    }, shadowGenerator.useCloseExponentialShadowMap))
    panel.addControl(this.debugChkBox('Use Blur Close Exponential ShadowMap', val => {
      shadowGenerator.useBlurCloseExponentialShadowMap = !shadowGenerator.useBlurCloseExponentialShadowMap
    }, shadowGenerator.useBlurCloseExponentialShadowMap))
    panel.addControl(this.debugChkBox('Use Percentage Closer Filtering', val => {
      shadowGenerator.usePercentageCloserFiltering = !shadowGenerator.usePercentageCloserFiltering
    }, shadowGenerator.usePercentageCloserFiltering))
    panel.addControl(this.debugChkBox('Use Contact Hardening Shadow', val => {
      shadowGenerator.useContactHardeningShadow = !shadowGenerator.useContactHardeningShadow
    }, shadowGenerator.useContactHardeningShadow))
    panel.addControl(this.debugChkBox('Force Back Faces Only', val => {
      shadowGenerator.forceBackFacesOnly = !shadowGenerator.forceBackFacesOnly
    }, shadowGenerator.forceBackFacesOnly))
    panel.addControl(this.debugChkBox('Use Kernel Blur', val => {
      shadowGenerator.useKernelBlur = !shadowGenerator.useKernelBlur
    }, shadowGenerator.useKernelBlur))
  }

  debugPanel () {
    let panel = new BABYLON.GUI.StackPanel()
    panel.width = '1024px'
    panel.isVertical = true
    panel.paddingRight = '20px'
    panel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT
    panel.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP

    return panel
  }

  debugChkBox (text, func, initialValue, left) {
    let checkbox = new BABYLON.GUI.Checkbox()
    checkbox.width = '20px'
    checkbox.height = '20px'
    checkbox.isChecked = initialValue
    checkbox.color = 'green'
    checkbox.fontSize = 12
    checkbox.onIsCheckedChangedObservable.add(value => func(value))

    const header = BABYLON.GUI.Control.AddHeader(checkbox, text, '180px', { isHorizontal: true, controlFirst: true })
    header.height = '30px'
    header.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT

    if (left) { header.left = left }

    return header
  }
}

export default SceneHouse
