import {SceneObject} from './index' // eslint-disable-line no-unused-vars

/**
 * 大纲类
 *
 * @export
 * @class OutLine
 * @extends {Map<string, SceneObject>}
 */
export default class Outline extends Map {
  /**
   * 获取大纲内资源是否已经全部加载
   *
   * @type {boolean}
   * @readonly
   * @memberof OutLine
   */
  get allIsLoaded () {
    for (let obj of this.values()) {
      if (!obj.assetsIsLoaded) return false
    }
    return true
  }
}
