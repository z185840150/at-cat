import * as BABYLON from 'babylonjs'

const {SceneLoaderProgressEvent: e} = BABYLON
/**
 * 场景对象资源加载过程事件
 *
 * @class SceneObjectAssetsLoaderProgressEvent
 * @extends {BABYLON.SceneLoaderProgressEvent}
 */
export default class SceneObjectAssetsLoaderProgressEvent extends e {
  /**
   * 百分比
   *
   * @readonly
   * @memberof SceneObjectAssetsLoaderProgressEvent
   */
  get percent () {
    return this.lengthComputable ? this.loaded / this.total * 100 : 0
  }
}
