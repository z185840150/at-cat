import * as BABYLON from 'babylonjs'

class FurMaterialDefines extends BABYLON.MaterialDefines {
  constructor (props) {
    super(props)
    this.DIFFUSE = false
    this.HEIGHTMAP = false
    this.CLIPPLANE = false
    this.ALPHATEST = false
    this.DEPTHPREPASS = false
    this.POINTSIZE = false
    this.FOG = false
    this.NORMAL = false
    this.UV1 = false
    this.UV2 = false
    this.VERTEXCOLOR = false
    this.VERTEXALPHA = false
    this.NUM_BONE_INFLUENCERS = 0
    this.BonesPerMesh = 0
    this.INSTANCES = false
    this.HIGHLEVEL = false
    this.rebuild()
  }
}

class FurMaterial extends BABYLON.PushMaterial {
  // #region property
  @BABYLON.serialize() get furTime () { return this._furTime }
  @BABYLON.serialize() set furTime (val) { this._furTime = val }

  @BABYLON.serialize() get highLevelFur () { return this._highLevelFur }
  @BABYLON.serialize() set highLevelFur (val) { this._highLevelFur = val }

  @BABYLON.serialize('maxSimultaneousLights')
  @BABYLON.expandToProperty('_markAllSubMeshesAsLightsDirty') get maxSimultaneousLights () { return this._maxSimultaneousLights }
  @BABYLON.serialize('maxSimultaneousLights')
  @BABYLON.expandToProperty('_markAllSubMeshesAsLightsDirty') set maxSimultaneousLights (val) { this._maxSimultaneousLights = val }

  @BABYLON.serialize('disableLighting')
  @BABYLON.expandToProperty('_markAllSubMeshesAsLightsDirty') get disableLighting () { return this._disableLighting }
  @BABYLON.serialize('disableLighting')
  @BABYLON.expandToProperty('_markAllSubMeshesAsLightsDirty') set highLevedisableLightinglFur (val) { this._disableLighting = val }

  @BABYLON.serialize() get furDensity () { return this._furDensity }
  @BABYLON.serialize() set furDensity (val) { this._furDensity = val }

  @BABYLON.serialize() get furSpeed () { return this._furSpeed }
  @BABYLON.serialize() set furSpeed (val) { this._furSpeed = val }

  @BABYLON.serializeAsVector3() get furGravity () { return this._furGravity }
  @BABYLON.serializeAsVector3() set furGravity (val) { this._furGravity = val }

  @BABYLON.serialize() get furSpacing () { return this._furSpacing }
  @BABYLON.serialize() set furSpacing (val) { this._furSpacing = val }

  @BABYLON.serialize() get furOffset () { return this._furOffset }
  @BABYLON.serialize() set furOffset (val) { this._furOffset = val }

  @BABYLON.serializeAsColor3() get furColor () { return this._furColor }
  @BABYLON.serializeAsColor3() set furColor (val) { this._furColor = val }

  @BABYLON.serialize() get furAngle () { return this._furAngle }
  @BABYLON.serialize() set furAngle (val) { this._furAngle = val }

  @BABYLON.serialize() get furLength () { return this._furLength }
  @BABYLON.serialize() set furLength (val) { this._furLength = val }

  /** 基本颜色 */
  @BABYLON.serializeAsColor3() get diffuseColor () { return this._diffuseColor }
  @BABYLON.serializeAsColor3() set diffuseColor (val) { this._diffuseColor = val }

  /** 基本颜色贴图 */
  @BABYLON.serializeAsTexture('diffuseTexture')
  @BABYLON.expandToProperty('_markAllSubMeshesAsTexturesDirty') get diffuseTexture () { return this._diffuseTexture }
  @BABYLON.serializeAsTexture('diffuseTexture')
  @BABYLON.expandToProperty('_markAllSubMeshesAsTexturesDirty') set diffuseTexture (val) { this._diffuseTexture = val }

  /** 区域遮罩贴图 */
  @BABYLON.serializeAsTexture('maskTexture')
  @BABYLON.expandToProperty('_markAllSubMeshesAsTexturesDirty') get maskTexture () { return this._maskTexture }
  @BABYLON.serializeAsTexture('maskTexture')
  @BABYLON.expandToProperty('_markAllSubMeshesAsTexturesDirty') set maskTexture (val) { this._maskTexture = val }

  /** 高度贴图 */
  @BABYLON.serializeAsTexture('heightTexture')
  @BABYLON.expandToProperty('_markAllSubMeshesAsTexturesDirty') get heightTexture () { return this._heightTexture }
  @BABYLON.serializeAsTexture('heightTexture')
  @BABYLON.expandToProperty('_markAllSubMeshesAsTexturesDirty') set heightTexture (val) { this._heightTexture = val }
  // #endregion

  constructor (name, scene) {
    super(name, scene)

    this.diffuseColor = new BABYLON.Color3(1, 1, 1)
    this.furLength = 1
    this.furAngle = 0
    this.furColor = new BABYLON.Color3(0.44, 0.21, 0.02)
    this.furOffset = 0.0
    this.furSpacing = 12
    this.furGravity = new BABYLON.Vector3(0, 0, 0)
    this.furSpeed = 100
    this.furDensity = 20
    this._disableLighting = false
    this._maxSimultaneousLights = 4
    this.highLevelFur = true
    this._furTime = 0
  }

  needAlphaBlending () { return (this.alpha < 1.0) }
  needAlphaTesting () { return false }
  getAlphaTestTexture () { return null }

  updateFur () {
    for (let i = 1; i < this._meshes.length; i++) {
      let offsetFur = this._meshes[i].material
      offsetFur.furLength = this.furLength
      offsetFur.furAngle = this.furAngle
      offsetFur.furGravity = this.furGravity
      offsetFur.furSpacing = this.furSpacing
      offsetFur.furSpeed = this.furSpeed
      offsetFur.furColor = this.furColor
      offsetFur.diffuseTexture = this.diffuseTexture
      offsetFur.furTexture = this.furTexture
      offsetFur.maskTexture = this.maskTexture
      offsetFur.highLevelFur = this.highLevelFur
      offsetFur.furTime = this.furTime
      offsetFur.furDensity = this.furDensity
    }
  }

  // Methods
  isReadyForSubMesh (mesh, subMesh, useInstances) {
    if (this.isFrozen) if (this._wasPreviouslyReady && subMesh.effect) return true
    if (!subMesh._materialDefines) subMesh._materialDefines = new BABYLON.FurMaterialDefines()

    let defines = subMesh._materialDefines
    let scene = this.getScene()

    if (!this.checkReadyOnEveryCall && subMesh.effect) if (this._renderId === scene.getRenderId()) return true

    let engine = scene.getEngine()

    // Textures
    if (defines._areTexturesDirty) {
      if (scene.texturesEnabled) {
        if (this.diffuseTexture && BABYLON.StandardMaterial.DiffuseTextureEnabled) {
          if (!this.diffuseTexture.isReady()) return false
          else {
            defines._needUVs = true
            defines.DIFFUSE = true
          }
        }
        if (this.heightTexture && engine.getCaps().maxVertexTextureImageUnits) {
          if (!this.heightTexture.isReady()) return false
          else {
            defines._needUVs = true
            defines.HEIGHTMAP = true
          }
        }
      }
    }
    // High level
    if (this.highLevelFur !== defines.HIGHLEVEL) {
      defines.HIGHLEVEL = true
      defines.markAsUnprocessed()
    }
    // Misc.
    BABYLON.MaterialHelper.PrepareDefinesForMisc(mesh, scene, false, this.pointsCloud, this.fogEnabled, this._shouldTurnAlphaTestOn(mesh), defines)
    // Lights
    defines._needNormals = BABYLON.MaterialHelper.PrepareDefinesForLights(scene, mesh, defines, false, this._maxSimultaneousLights, this._disableLighting)
    // Values that need to be evaluated on every frame
    BABYLON.MaterialHelper.PrepareDefinesForFrameBoundValues(scene, engine, defines, !!useInstances)
    // Attribs
    BABYLON.MaterialHelper.PrepareDefinesForAttributes(mesh, defines, true, true)

    // Get correct effect
    if (defines.isDirty) {
      defines.markAsProcessed()
      scene.resetCachedMaterial()
      // Fallbacks
      let fallbacks = new BABYLON.EffectFallbacks()
      if (defines.FOG) fallbacks.addFallback(1, 'FOG')

      BABYLON.MaterialHelper.HandleFallbacksForShadows(defines, fallbacks, this.maxSimultaneousLights)
      if (defines.NUM_BONE_INFLUENCERS > 0) fallbacks.addCPUSkinningFallback(0, mesh)

      // Attributes
      let attribs = [BABYLON.VertexBuffer.PositionKind]
      if (defines.NORMAL) attribs.push(BABYLON.VertexBuffer.NormalKind)
      if (defines.UV1) attribs.push(BABYLON.VertexBuffer.UVKind)
      if (defines.UV2) attribs.push(BABYLON.VertexBuffer.UV2Kind)
      if (defines.VERTEXCOLOR) attribs.push(BABYLON.VertexBuffer.ColorKind)
      BABYLON.MaterialHelper.PrepareAttributesForBones(attribs, mesh, defines, fallbacks)
      BABYLON.MaterialHelper.PrepareAttributesForInstances(attribs, defines)
      // Legacy browser patch
      let shaderName = 'fur'
      let join = defines.toString()
      let uniforms = ['world', 'view', 'viewProjection', 'vEyePosition', 'vLightsType', 'vDiffuseColor',
        'vFogInfos', 'vFogColor', 'pointSize',
        'vDiffuseInfos',
        'mBones',
        'vClipPlane', 'diffuseMatrix',
        'furLength', 'furAngle', 'furColor', 'furOffset', 'furGravity', 'furTime', 'furSpacing', 'furDensity'
      ]
      let samplers = ['diffuseSampler', 'heightTexture', 'furTexture', 'maskTexture']
      let uniformBuffers = []
      BABYLON.MaterialHelper.PrepareUniformsAndSamplersList({
        uniformsNames: uniforms,
        uniformBuffersNames: uniformBuffers,
        samplers: samplers,
        defines: defines,
        maxSimultaneousLights: this.maxSimultaneousLights
      })
      subMesh.setEffect(scene.getEngine().createEffect(shaderName, {
        attributes: attribs,
        uniformsNames: uniforms,
        uniformBuffersNames: uniformBuffers,
        samplers: samplers,
        defines: join,
        fallbacks: fallbacks,
        onCompiled: this.onCompiled,
        onError: this.onError,
        indexParameters: { maxSimultaneousLights: this.maxSimultaneousLights }
      }, engine), defines)
    }

    if (!subMesh.effect || !subMesh.effect.isReady()) return false
    this._renderId = scene.getRenderId()
    this._wasPreviouslyReady = true
    return true
  }
  bindForSubMesh (world, mesh, subMesh) {
    const scene = this.getScene()
    const defines = subMesh._materialDefines
    if (!defines) return
    const effect = subMesh.effect
    if (!effect) return

    this._activeEffect = effect

    // Matrices
    this.bindOnlyWorldMatrix(world)
    this._activeEffect.setMatrix('viewProjection', scene.getTransformMatrix())

    // Bones
    BABYLON.MaterialHelper.BindBonesParameters(mesh, this._activeEffect)
    if (scene.getCachedMaterial() !== this) {
      // Textures
      if (this._diffuseTexture && BABYLON.StandardMaterial.DiffuseTextureEnabled) {
        this._activeEffect.setTexture('diffuseSampler', this._diffuseTexture)
        this._activeEffect.setFloat2('vDiffuseInfos', this._diffuseTexture.coordinatesIndex, this._diffuseTexture.level)
        this._activeEffect.setMatrix('diffuseMatrix', this._diffuseTexture.getTextureMatrix())
      }
      if (this._heightTexture) this._activeEffect.setTexture('heightTexture', this._heightTexture)
      // Clip plane
      BABYLON.MaterialHelper.BindClipPlane(this._activeEffect, scene)
      // Point size
      if (this.pointsCloud) this._activeEffect.setFloat('pointSize', this.pointSize)
      BABYLON.MaterialHelper.BindEyePosition(effect, scene)
    }
    this._activeEffect.setColor4('vDiffuseColor', this.diffuseColor, this.alpha * mesh.visibility)
    if (scene.lightsEnabled && !this.disableLighting) {
      BABYLON.MaterialHelper.BindLights(scene, mesh, this._activeEffect, defines, this.maxSimultaneousLights)
    }

    // View
    if (scene.fogEnabled && mesh.applyFog && scene.fogMode !== BABYLON.Scene.FOGMODE_NONE) {
      this._activeEffect.setMatrix('view', scene.getViewMatrix())
    }

    // Fog
    BABYLON.MaterialHelper.BindFogParameters(scene, mesh, this._activeEffect)
    this._activeEffect.setFloat('furLength', this.furLength)
    this._activeEffect.setFloat('furAngle', this.furAngle)
    this._activeEffect.setColor4('furColor', this.furColor, 1.0)
    if (this.highLevelFur) {
      this._activeEffect.setVector3('furGravity', this.furGravity)
      this._activeEffect.setFloat('furOffset', this.furOffset)
      this._activeEffect.setFloat('furSpacing', this.furSpacing)
      this._activeEffect.setFloat('furDensity', this.furDensity)
      this._furTime += this.getScene().getEngine().getDeltaTime() / this.furSpeed
      this._activeEffect.setFloat('furTime', this._furTime)
      this._activeEffect.setTexture('furTexture', this.furTexture)
    }

    this._afterBind(mesh, this._activeEffect)
  }
  getAnimatables () {
    let results = []
    if (this.diffuseTexture && this.diffuseTexture.animations && this.diffuseTexture.animations.length > 0) {
      results.push(this.diffuseTexture)
    }
    if (this.heightTexture && this.heightTexture.animations && this.heightTexture.animations.length > 0) {
      results.push(this.heightTexture)
    }
    return results
  }
  getActiveTextures () {
    let activeTextures = super.getActiveTextures()

    if (this._diffuseTexture) activeTextures.push(this._diffuseTexture)

    if (this._heightTexture) activeTextures.push(this._heightTexture)

    return activeTextures
  }
  hasTexture (texture) {
    if (super.hasTexture(texture)) return true

    if (this.diffuseTexture === texture) return true

    if (this._heightTexture === texture) return true

    return false
  }
  dispose (forceDisposeEffect) {
    if (this.diffuseTexture) this.diffuseTexture.dispose()
    if (this._meshes) {
      for (var i = 1; i < this._meshes.length; i++) {
        var mat = this._meshes[i].material
        if (mat) {
          mat.dispose(forceDisposeEffect)
        }
        this._meshes[i].dispose()
      }
    }
    super.dispose(forceDisposeEffect)
  }
  clone (name) {
    return BABYLON.SerializationHelper.Clone(() => { return new FurMaterial(name, this.getScene()) }, this)
  }
  serialize () {
    let serializationObject = BABYLON.SerializationHelper.Serialize(this)
    serializationObject.customType = 'BABYLON.FurMaterial'
    if (this._meshes) {
      serializationObject.sourceMeshName = this._meshes[0].name
      serializationObject.quality = this._meshes.length
    }
    return serializationObject
  }
  getClassName () {
    return 'FurMaterial'
  }

  // Statics
  static Parse (source, scene, rootUrl) {
    let material = BABYLON.SerializationHelper.Parse(() => new FurMaterial(source.name, scene), source, scene, rootUrl)
    if (source.sourceMeshName && material.highLevelFur) {
      scene.executeWhenReady(() => {
        let sourceMesh = scene.getMeshByName(source.sourceMeshName)
        if (sourceMesh) {
          const furTexture = FurMaterial.GenerateTexture('Fur Texture', scene)
          material.furTexture = furTexture
          FurMaterial.FurifyMesh(sourceMesh, source.quality)
        }
      })
    }
    return material
  }
  static GenerateTexture (name, scene) {
    // Generate fur textures
    let texture = new BABYLON.DynamicTexture('FurTexture ' + name, 256, scene, true)
    let context = texture.getContext()
    for (let i = 0; i < 20000; ++i) {
      context.fillStyle = `rgba(255, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 1)`
      context.fillRect((Math.random() * texture.getSize().width), (Math.random() * texture.getSize().height), 2, 2)
    }
    texture.update(false)
    texture.wrapU = BABYLON.Texture.WRAP_ADDRESSMODE
    texture.wrapV = BABYLON.Texture.WRAP_ADDRESSMODE

    return texture
  }
  /** Creates and returns an array of meshes used as shells for the Fur Material
   * that can be disposed later in your code
   * The quality is in interval [0, 100]
   */
  static FurifyMesh (sourceMesh, quality) {
    let meshes = [sourceMesh]
    let mat = sourceMesh.material

    if (!(mat instanceof FurMaterial)) throw new Error('The material of the source mesh must be a Fur Material')

    for (let i = 1; i < quality; i++) {
      let offsetFur = new BABYLON.FurMaterial(mat.name + i, sourceMesh.getScene())
      sourceMesh.getScene().materials.pop()
      BABYLON.Tags.EnableFor(offsetFur)
      BABYLON.Tags.AddTagsTo(offsetFur, 'furShellMaterial')
      offsetFur.furLength = mat.furLength
      offsetFur.furAngle = mat.furAngle
      offsetFur.furGravity = mat.furGravity
      offsetFur.furSpacing = mat.furSpacing
      offsetFur.furSpeed = mat.furSpeed
      offsetFur.furColor = mat.furColor
      offsetFur.diffuseTexture = mat.diffuseTexture
      offsetFur.furOffset = i / quality
      offsetFur.furTexture = mat.furTexture
      offsetFur.highLevelFur = mat.highLevelFur
      offsetFur.furTime = mat.furTime
      offsetFur.furDensity = mat.furDensity

      let offsetMesh = sourceMesh.clone(sourceMesh.name + i)
      offsetMesh.material = offsetFur
      offsetMesh.skeleton = sourceMesh.skeleton
      offsetMesh.position = BABYLON.Vector3.Zero()
      meshes.push(offsetMesh)
    }
    for (let i = 1; i < meshes.length; i++) { meshes[i].parent = sourceMesh }
    sourceMesh.material._meshes = meshes
    return meshes
  }
}

BABYLON.FurMaterialDefines = FurMaterialDefines
BABYLON.FurMaterial = FurMaterial

BABYLON.Effect.ShadersStore['furVertexShader'] = `
  precision highp float;

  attribute vec3 position;
  attribute vec3 normal;
  #ifdef UV1
  attribute vec2 uv;
  #endif
  #ifdef UV2
  attribute vec2 uv2;
  #endif
  #ifdef VERTEXCOLOR
  attribute vec4 color;
  #endif
  #include<bonesDeclaration>

  uniform float furLength;
  uniform float furAngle;
  #ifdef HIGHLEVEL
  uniform float furOffset;
  uniform vec3 furGravity;
  uniform float furTime;
  uniform float furSpacing;
  uniform float furDensity;
  #endif
  #ifdef HEIGHTMAP
  uniform sampler2D heightTexture;
  #endif
  #ifdef HIGHLEVEL
  varying vec2 vFurUV;
  #endif
  #include<instancesDeclaration>
  uniform mat4 view;
  uniform mat4 viewProjection;
  #ifdef DIFFUSE
  varying vec2 vDiffuseUV;
  uniform mat4 diffuseMatrix;
  uniform vec2 vDiffuseInfos;
  #endif
  #ifdef POINTSIZE
  uniform float pointSize;
  #endif

  varying vec3 vPositionW;
  #ifdef NORMAL
  varying vec3 vNormalW;
  #endif
  varying float vfur_length;
  #ifdef VERTEXCOLOR
  varying vec4 vColor;
  #endif
  #include<clipPlaneVertexDeclaration>
  #include<fogVertexDeclaration>
  #include<__decl__lightFragment>[0..maxSimultaneousLights]
  float Rand(vec3 rv) {
    float x=dot(rv,vec3(12.9898,78.233,24.65487));
    return fract(sin(x)*43758.5453);
  }
  void main(void) {
    #include<instancesVertex>
    #include<bonesVertex>

    float r=Rand(position);
    #ifdef HEIGHTMAP
    #if __VERSION__>100
    vfur_length=furLength*texture(heightTexture,uv).x;
    #else
    vfur_length=furLength*texture2D(heightTexture,uv).r;
    #endif
    #else
    vfur_length=(furLength*r);
    #endif
    vec3 tangent1=vec3(normal.y,-normal.x,0);
    vec3 tangent2=vec3(-normal.z,0,normal.x);
    r=Rand(tangent1*r);
    float J=(2.0+4.0*r);
    r=Rand(tangent2*r);
    float K=(2.0+2.0*r);
    tangent1=tangent1*J+tangent2*K;
    tangent1=normalize(tangent1);
    vec3 newPosition=position+normal*vfur_length*cos(furAngle)+tangent1*vfur_length*sin(furAngle);
    #ifdef HIGHLEVEL

    vec3 forceDirection=vec3(0.0,0.0,0.0);
    forceDirection.x=sin(furTime+position.x*0.05)*0.2;
    forceDirection.y=cos(furTime*0.7+position.y*0.04)*0.2;
    forceDirection.z=sin(furTime*0.7+position.z*0.04)*0.2;
    vec3 displacement=vec3(0.0,0.0,0.0);
    displacement=furGravity+forceDirection;
    float displacementFactor=pow(furOffset,3.0);
    vec3 aNormal=normal;
    aNormal.xyz+=displacement*displacementFactor;
    newPosition=vec3(newPosition.x,newPosition.y,newPosition.z)+(normalize(aNormal)*furOffset*furSpacing);
    #endif
    #ifdef NORMAL
    vNormalW=normalize(vec3(finalWorld*vec4(normal,0.0)));
    #endif

    gl_Position=viewProjection*finalWorld*vec4(newPosition,1.0);
    vec4 worldPos=finalWorld*vec4(newPosition,1.0);
    vPositionW=vec3(worldPos);

    #ifndef UV1
    vec2 uv=vec2(0.,0.);
    #endif
    #ifndef UV2
    vec2 uv2=vec2(0.,0.);
    #endif
    #ifdef DIFFUSE
    if (vDiffuseInfos.x == 0.)
    {
      vDiffuseUV=vec2(diffuseMatrix*vec4(uv,1.0,0.0));
    }
    else
    {
      vDiffuseUV=vec2(diffuseMatrix*vec4(uv2,1.0,0.0));
    }
    #ifdef HIGHLEVEL
    vFurUV=vDiffuseUV*furDensity;
    #endif
    #else
    #ifdef HIGHLEVEL
    vFurUV=uv*furDensity;
    #endif
    #endif

    #include<clipPlaneVertex>

    #include<fogVertex>

    #include<shadowsVertex>[0..maxSimultaneousLights]

    #ifdef VERTEXCOLOR
    vColor=color;
    #endif

    #ifdef POINTSIZE
    gl_PointSize=pointSize;
    #endif
  }`
BABYLON.Effect.ShadersStore['furPixelShader'] = `
  precision highp float;

  uniform vec3 vEyePosition;
  uniform vec4 vDiffuseColor;

  uniform vec4 furColor;
  uniform float furLength;
  varying vec3 vPositionW;
  varying float vfur_length;

  #ifdef NORMAL
  varying vec3 vNormalW;
  #endif
  
  #ifdef VERTEXCOLOR
  varying vec4 vColor;
  #endif

  #include<helperFunctions>

  #include<__decl__lightFragment>[0..maxSimultaneousLights]

  #ifdef DIFFUSE
  varying vec2 vDiffuseUV;
  uniform sampler2D diffuseSampler;
  uniform vec2 vDiffuseInfos;
  #endif

  uniform sampler2D maskTexture;

  #ifdef HIGHLEVEL
  uniform float furOffset;
  uniform sampler2D furTexture;
  varying vec2 vFurUV;
  #endif
  #include<lightsFragmentFunctions>
  #include<shadowsFragmentFunctions>
  #include<fogFragmentDeclaration>
  #include<clipPlaneFragmentDeclaration>

  float Rand(vec3 rv) {
    float x=dot(rv,vec3(12.9898,78.233,24.65487));
    return fract(sin(x)*43758.5453);
  }

  void main(void) {

    #include<clipPlaneFragment>
    vec3 viewDirectionW=normalize(vEyePosition - vPositionW);

    vec4 baseColor = furColor;
    vec3 diffuseColor=vDiffuseColor.rgb;

    float alpha = vDiffuseColor.a;

    #ifdef DIFFUSE
    baseColor *= texture2D(diffuseSampler, vDiffuseUV);
    #ifdef ALPHATEST
    if (baseColor.a<0.4)
    discard;
    #endif
    #include<depthPrePass>
    baseColor.rgb *= vDiffuseInfos.y;
    #endif
    #ifdef VERTEXCOLOR
    baseColor.rgb *= vColor.rgb;
    #endif

    #ifdef NORMAL
    vec3 normalW=normalize(vNormalW);
    #else
    vec3 normalW=vec3(1.0, 1.0, 1.0);
    #endif

    #ifdef HIGHLEVEL
    vec4 furTextureColor=texture2D(furTexture,vec2(vFurUV.x,vFurUV.y));
    if (furTextureColor.a<=0.0 || furTextureColor.g<furOffset) {
      discard;
    }
    float occlusion = mix(0.0, furTextureColor. b* 1.2, furOffset);
    baseColor=vec4(baseColor.xyz * occlusion, 1.1 - furOffset);
    #endif

    vec3 diffuseBase=vec3(0.,0.,0.);
    lightingInfo info;
    float shadow=1.;
    float glossiness=0.;
    #ifdef SPECULARTERM
    vec3 specularBase=vec3(0.,0.,0.);
    #endif
    #include<lightFragment>[0..maxSimultaneousLights]
    #ifdef VERTEXALPHA
    alpha *= vColor.a;
    #endif
    vec3 finalDiffuse=clamp(diffuseBase.rgb*baseColor.rgb,0.0,1.0);

    #ifdef HIGHLEVEL
    vec4 color=vec4(finalDiffuse, alpha);
    #else
    float r=vfur_length/furLength*0.5;
    vec4 color=vec4(finalDiffuse*(0.5+r),alpha);
    #endif
    #include<fogFragment>
    
    gl_FragColor=color;
  }`
