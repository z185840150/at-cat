import * as BABYLON from 'babylonjs'

class TargetMaker {
  /** @type {BABYLON.Mesh} */
  get sourceMesh () { return this._sourceMesh }
  set sourceMesh (val) { this._sourceMesh = val }
  /** @type {BABYLON.Mesh} */
  get targetMesh () { return this._targetMesh }
  set targetMesh (val) { this._targetMesh = val }

  constructor (sourceMesh, targetMesh) {
    this._sourceMesh = sourceMesh
    this._targetMesh = targetMesh
  }

  build (filePath, fileName) {
    if (this.sourceMesh && this.targetMesh) {
      const source = { mesh: this.sourceMesh }
      const target = { mesh: this.targetMesh }

      source.p = source.mesh.getVerticesData(BABYLON.VertexBuffer.PositionKind)
      target.p = target.mesh.getVerticesData(BABYLON.VertexBuffer.PositionKind)

      if (source.p.length !== target.p.length) return console.error(new Error('different mesh vertex count.'))

      let result = ``

      for (let i = 0; i < source.p.length / 3; i++) {
        let sourceVertex = new BABYLON.Vector3(source.p[i * 3], source.p[i * 3 + 1], source.p[i * 3 + 2])
        let targetVertex = new BABYLON.Vector3(target.p[i * 3], target.p[i * 3 + 1], target.p[i * 3 + 2])

        if (BABYLON.Vector3.Distance(sourceVertex, targetVertex) > 0) {
          // let x = (targetVertex.x - sourceVertex.x).toFixed(4)
          // let y = (targetVertex.y - sourceVertex.y).toFixed(4)
          // let z = (targetVertex.z - sourceVertex.z).toFixed(4)
          // result += (x > 0 || y > 0 || z > 0) ? `${i} ${x > 0 ? x : 0} ${y > 0 ? y : 0} ${z > 0 ? z : 0}\n` : ''
          result += `${i} ${targetVertex.x} ${targetVertex.y} ${targetVertex.z}\n`
        }
      }

      // result = Buffer.from(result).toString('base64')
      console.log(result)
    } else {
      console.error(new Error('TargetMaker 必须需求源网格以及目标网格'))
    }
  }
}

export default TargetMaker
