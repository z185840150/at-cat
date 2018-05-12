import * as BABYLON from 'babylonjs' // eslint-disable-line
import { Game, CatGene } from './index' // eslint-disable-line

export default class CatMesh {
  /**
   * 游戏
   *
   * @type {Game}
   * @memberof CatMaker
   */
  get game () { return this._game }
  set game (val) { this._game = val }
  /**
   * 基因
   *
   * @type {Object.<string, CatGene>}
   * @memberof CatMaker
   */
  get genes () { return this._genes }
  set genes (val) { this._genes = val }
  /**
   * 每只猫的点数据
   *
   * @type {Object.<string, number[]>}
   * @memberof CatMesh
   */
  get positions () { return this._positions }
  set positions (val) { this._positions = val }
  /**
   * 基本坐标
   *
   * @type {number[]}
   * @memberof CatMesh
   */
  get basePosition () { return this._basePosition }
  set basePosition (val) { this._basePosition = val }
  /**
   * 所有模型
   *
   * @type {Object.<string, BABYLON.Mesh>}
   * @memberof CatMesh
   */
  get meshs () { return this._meshs }
  set meshs (val) { this._meshs = val }
  /**
   * 所有材质
   *
   * @type {Object.<string, BABYLON.PBRMaterial>}
   * @memberof CatMesh
   */
  get mats () { return this._mats }
  set mats (val) { this._mats = val }
  /**
   * 所显示的猫的基因key的顺序索引
   *
   * @type {number}
   * @memberof CatMesh
   */
  get index () { return this._index }
  set index (val) { this._index = val }
  /**
   * 所显示的猫的hash
   *
   * @type {string}
   * @readonly
   * @memberof CatMesh
   */
  get hash () { return Object.keys(this.genes)[this.index] }
  /**
   * 构造函数
   * @memberof CatMesh
   */
  constructor (game) {
    this._game = game
    this._genes = {}
    this._positions = {}
    this._meshs = {}
    this._mats = {}
    this._index = 0
  }

  async loadAssetsAsync () {
    await BABYLON.SceneLoader.ImportMeshAsync('', './static/assets/resources/cat/babylon/', 'cat.babylon', this.game.scene)
      .then(({meshes}) => {
        for (let i = 0; i < meshes.length; i++) {
          this.meshs[meshes[i].name] = meshes[i]
          if (meshes[i].material) {
            meshes[i].receiveShadows = true // 开启接受阴影
            const name = meshes[i].material.name
            if (meshes[i].material.name !== 'm_cat_eye_glass_pbr_mr') {
              this.mats[name] = new BABYLON.PBRMaterial(meshes[i].material.name, this.game.scene)
              meshes[i].material.dispose()
              // this.mats[name] && this.mats[name].dispose()
              meshes[i].material = this.mats[name]
              this.game.shadowGenerator.getShadowMap().renderList.push(meshes[i])
            }
          }
        }
        this.meshs.cat_eye_left_glass.material.dispose()
        // this.meshs.cat_eye_right_glass.material.dispose()
        this.mats.m_cat_eye_glass_pbr_mr = new BABYLON.PBRMaterial('m_cat_eye_glass_pbr_mr', this.game.scene)
        this.meshs.cat_eye_left_glass.material = this.mats['m_cat_eye_glass_pbr_mr']
        this.meshs.cat_eye_right_glass.material = this.mats['m_cat_eye_glass_pbr_mr']

        this.basePosition = [].concat(this.meshs.cat_body.getVerticesData(BABYLON.VertexBuffer.PositionKind))
      })
  }
}
