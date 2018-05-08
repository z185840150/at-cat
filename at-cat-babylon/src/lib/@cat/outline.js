import {SceneObject} from './index' // eslint-disable-line no-unused-vars

/**
 * 大纲类
 *
 * @export
 * @class OutLine
 * @type {Map<string, SceneObject>}
 * @extends {Map<string, SceneObject>}
 */
export default class OutLine extends Map {
  /**
   * 获取大纲内资源是否已经全部加载
   *
   * @type {boolean}
   * @readonly
   * @memberof OutLine
   */
  get allLoaded () {
    for (let obj of this.values()) {
      if (!obj.assetsLoaded) return false
    }
    return true
  }
}
