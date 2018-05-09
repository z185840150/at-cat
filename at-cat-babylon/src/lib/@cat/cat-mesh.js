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
   * @type {any}
   * @memberof CatMaker
   */
  get genes () { return this._genes }
  set genes (val) { this._genes = val }
  /**
   * 每只猫的点数据
   *
   * @type {Map<string, number[]>}
   * @memberof CatMesh
   */
  get postions () { return this._postions }
  set postions (val) { this._postions = val }
  /**
   * 基本坐标
   *
   * @type {number[]}
   * @memberof CatMesh
   */
  get basePosition () { return this._basePosition }
  set basePosition (val) { this._basePosition = val }
  /**
   * 基本模型
   *
   * @type {BABYLON}
   * @memberof CatMesh
   */
  get meshs () { return this._meshs }
  set meshs (val) {
    this._meshs = val
  }
  /**
   * 构造函数
   * @memberof CatMesh
   */
  constructor (game) {
    console.log('catmesh 构造')
    this._game = game
    this._genes = {}
    this._postions = {}
    this._meshs = {}
  }

  async loadAssetsAsync () {
    await BABYLON.SceneLoader.ImportMeshAsync('cat_body',
      './static/assets/resources/cat/babylon/',
      'cat-target.babylon', this.game.scene)
      .then(({meshes, skeletons}) => {
        this.meshs['body'] = meshes[0]
        this.basePosition = [].concat(this.meshs['body'].getVerticesData(BABYLON.VertexBuffer.PositionKind))
      })
  }
}
