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
