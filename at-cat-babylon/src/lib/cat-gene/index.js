// eslint-disable-next-line no-unused-vars
import Breeds from './../cat-breeds'

export default class Gene {
  set breeds (val) { this._breeds = val }
  set age (val) { this._age = val }
  set sex (val) { this._sex = val }
  set fatRate (val) { this._fatRate = val }
  set weight (val) { this._weight = val }
  set height (val) { this._height = val }

  set headAge (val) { this._headAge = val }
  set headFat (val) { this._headFat = val }
  set headAngle (val) { this._headAngle = val }
  set headOval (val) { this._headOval = val }
  set headRound (val) { this._headRound = val }
  set headRectangular (val) { this._headRectangular = val }
  set headSquare (val) { this._headSquare = val }
  set headTriangular (val) { this._headTriangular = val }
  set headInvertedTriangular (val) { this._headInvertedTriangular = val }
  set headDiamond (val) { this._headDiamond = val }
  set headParietalScaleDepth (val) { this._headParietalScaleDepth = val }
  set headScaleDepth (val) { this._headScaleDepth = val }
  set headScaleHorizontally (val) { this._headScaleHorizontally = val }
  set headScaleVertically (val) { this._headScaleVertically = val }
  set headMoveHorizontally (val) { this._headMoveHorizontally = val }
  set headMoveVertically (val) { this._headMoveVertically = val }
  set headMoveDepth (val) { this._headMoveDepth = val }

  set foreheadBulge (val) { this._foreheadBulge = val }
  set foreheadScaleVertically (val) { this._foreheadScaleVertically = val }
  set foreheadCranicShape (val) { this._foreheadCranicShape = val }
  set foreheadTempleBulge (val) { this._foreheadTempleBulge = val }

  set eyebrowsBulge (val) { this._eyebrowsBulge = val }
  set eyebrowsAngle (val) { this._eyebrowsAngle = val }
  set eyebrowsMoveVertically (val) { this._eyebrowsMoveVertically = val }

  set neckDouble (val) { this._neckDouble = val }
  set neckScaleDepth (val) { this._neckScaleDepth = val }
  set neckScaleDepthOfNape (val) { this._neckScaleDepthOfNape = val }
  set neckScaleHorizontally (val) { this._neckScaleHorizontally = val }
  set neckScaleVertically (val) { this._neckScaleVertically = val }
  set neckMoveDepth (val) { this._neckMoveDepth = val }
  set neckMoveHorizontally (val) { this._neckMoveHorizontally = val }
  set neckMoveVertically (val) { this._neckMoveVertically = val }

  set eyeColorLeft (val) { this._eyeColorLeft = val }
  set eyeColorRight (val) { this._eyeColorRight = val }
  set eyeBagVolume (val) { this._eyeBagVolume = val }
  set eyeBagDistorsion (val) { this._eyeBagDistorsion = val }
  set eyeBagHeight (val) { this._eyeBagHeight = val }
  set eyeFoldAngle (val) { this._eyeFoldAngle = val }
  set eyeFoldVolume (val) { this._eyeFoldVolume = val }
  set eyeEpicanthus (val) { this._eyeEpicanthus = val }
  set eyeScaleHeight0 (val) { this._eyeScaleHeight0 = val }
  set eyeScaleHeight1 (val) { this._eyeScaleHeight1 = val }
  set eyeScaleHeight2 (val) { this._eyeScaleHeight2 = val }
  set eyeScaleHeight3 (val) { this._eyeScaleHeight3 = val }
  set eyeScaleHeight4 (val) { this._eyeScaleHeight4 = val }
  set eyeMoveOuterCornerHorizontally (val) { this._eyeMoveOuterCornerHorizontally = val }
  set eyeMoveInnerCornerHorizontally (val) { this._eyeMoveInnerCornerHorizontally = val }
  set eyeMoveOuterCornerVertically (val) { this._eyeMoveOuterCornerVertically = val }
  set eyeMoveInnerCornerVertically (val) { this._eyeMoveInnerCornerVertically = val }
  set eyeMoveHorizontally (val) { this._eyeMoveHorizontally = val }
  set eyeMoveVertically (val) { this._eyeMoveVertically = val }
  set eyeScale (val) { this._eyeScale = val }

  // 基本形态
  /** 品种 @type {Breeds} */ get breeds () { return this._breeds }
  /** 年龄 @type {Number} */ get age () { return this._age }
  /** 性别 @type {Number} */ get sex () { return this._sex }
  /** 体脂 @type {Number} */ get fatRate () { return this._fatRate }
  /** 体重 @type {Number} */ get weight () { return this._weight }
  /** 身高 @type {Number} */ get height () { return this._height }

  // 头部形态
  /** 面部年龄 @type {Number} */ get headAge () { return this._headAge }
  /** 面部肥胖 @type {Number} */ get headFat () { return this._headFat }
  /** 面部角度 @type {Number} */ get headAngle () { return this._headAngle }
  /** 面部椭圆形 @type {Number} */ get headOval () { return this._headOval }
  /** 面部圆形 @type {Number} */ get headRound () { return this._headRound }
  /** 面部矩形 @type {Number} */ get headRectangular () { return this._headRectangular }
  /** 面部正方形 @type {Number} */ get headSquare () { return this._headSquare }
  /** 面部正三角形 @type {Number} */ get headTriangular () { return this._headTriangular }
  /** 面部倒三角形 @type {Number} */ get headInvertedTriangular () { return this._headInvertedTriangular }
  /** 面部菱形形态 @type {Number} */ get headDiamond () { return this._headDiamond }
  /** 头顶缩放深度 @type {Number} */ get headParietalScaleDepth () { return this._headParietalScaleDepth }
  /** 头部缩放深度 @type {Number} */ get headScaleDepth () { return this._headScaleDepth }
  /** 头部水平缩放 @type {Number} */ get headScaleHorizontally () { return this._headScaleHorizontally }
  /** 头部垂直缩放 @type {Number} */ get headScaleVertically () { return this._headScaleVertically }
  /** 头部水平位移 @type {Number} */ get headMoveHorizontally () { return this._headMoveHorizontally }
  /** 头部垂直位移 @type {Number} */ get headMoveVertically () { return this._headMoveVertically }
  /** 头部深度位移 @type {Number} */ get headMoveDepth () { return this._headMoveDepth }

  // 额头形态
  /** 额头凸起 @type {Number} */ get foreheadBulge () { return this._foreheadBulge }
  /** 额头垂直缩放 @type {Number} */ get foreheadScaleVertically () { return this._foreheadScaleVertically }
  /** 额头颅骨凸起 @type {Number} */ get foreheadCranicShape () { return this._foreheadCranicShape }
  /** 额头太阳穴凸起 @type {Number} */ get foreheadTempleBulge () { return this._foreheadTempleBulge }

  // 眉骨
  /** 眉骨凸起 @type {Number} */ get eyebrowsBulge () { return this._eyebrowsBulge }
  /** 眉骨角度 @type {Number} */ get eyebrowsAngle () { return this._eyebrowsAngle }
  /** 眉骨垂直位移 @type {Number} */ get eyebrowsMoveVertically () { return this._eyebrowsMoveVertically }

  // 颈部
  /** 颈部双下巴 @type {Number} */ get neckDouble () { return this._neckDouble }
  /** 颈部深度缩放 @type {Number} */ get neckScaleDepth () { return this._neckScaleDepth }
  /** 后颈深度缩放 @type {Number} */ get neckScaleDepthOfNape () { return this._neckScaleDepthOfNape }
  /** 颈部水平缩放 @type {Number} */ get neckScaleHorizontally () { return this._neckScaleHorizontally }
  /** 颈部垂直缩放 @type {Number} */ get neckScaleVertically () { return this._neckScaleVertically }
  /** 颈部深度位移 @type {Number} */ get neckMoveDepth () { return this._neckMoveDepth }
  /** 颈部水平位移 @type {Number} */ get neckMoveHorizontally () { return this._neckMoveHorizontally }
  /** 颈部垂直位移 @type {Number} */ get neckMoveVertically () { return this._neckMoveVertically }

  // 眼睛
  /** 左眼颜色 @type {Number[]} */ get eyeColorLeft () { return this._eyeColorLeft }
  /** 右眼颜色 @type {Number[]} */ get eyeColorRight () { return this._eyeColorRight }
  /** 眼袋体积 @type {Number} */ get eyeBagVolume () { return this._eyeBagVolume }
  /** 眼袋歪曲 @type {Number} */ get eyeBagDistorsion () { return this._eyeBagDistorsion }
  /** 眼袋高度 @type {Number} */ get eyeBagHeight () { return this._eyeBagHeight }
  /** 眼褶角度 @type {Number} */ get eyeFoldAngle () { return this._eyeFoldAngle }
  /** 眼褶体积 @type {Number} */ get eyeFoldVolume () { return this._eyeFoldVolume }
  /** 眼内眦赘皮深度 @type {Number} */ get eyeEpicanthus () { return this._eyeEpicanthus }
  /** 高度（内眼角方向开始） @type {Number} */ get eyeScaleHeight0 () { return this._eyeScaleHeight0 }
  /** 高度（内眼角方向开始） @type {Number} */ get eyeScaleHeight1 () { return this._eyeScaleHeight1 }
  /** 高度（内眼角方向开始） @type {Number} */ get eyeScaleHeight2 () { return this._eyeScaleHeight2 }
  /** 高度（内眼角方向开始） @type {Number} */ get eyeScaleHeight3 () { return this._eyeScaleHeight3 }
  /** 高度（内眼角方向开始） @type {Number} */ get eyeScaleHeight4 () { return this._eyeScaleHeight4 }
  /** 眼角水平位移 @type {Number} */ get eyeMoveOuterCornerHorizontally () { return this._eyeMoveOuterCornerHorizontally }
  /** 内眼角水平位移 @type {Number} */ get eyeMoveInnerCornerHorizontally () { return this._eyeMoveInnerCornerHorizontally }
  /** 眼角垂直位移 @type {Number} */ get eyeMoveOuterCornerVertically () { return this._eyeMoveOuterCornerVertically }
  /** 内眼角垂直位移 @type {Number} */ get eyeMoveInnerCornerVertically () { return this._eyeMoveInnerCornerVertically }
  /** 眼睛水平移动 @type {Number} */ get eyeMoveHorizontally () { return this._eyeMoveHorizontally }
  /** 眼睛垂直移动 @type {Number} */ get eyeMoveVertically () { return this._eyeMoveVertically }
  /** 眼睛缩放 @type {Number} */ get eyeScale () { return this._eyeScale }

  // 乳房形态 仅限母猫(sex < 0.5)
  /** 乳房大小 @type {Number} */ get breastCupSize () { return this._breastCupSize }
  /** 乳房坚挺 @type {Number} */ get breastFirmness () { return this._breastFirmness }
  /** 乳房垂直位移 @type {Number} */ get breastVerticalPosition () { return this._breastVerticalPosition }
  /** 乳房水平位移 @type {Number} */ get breastHorizontalPosition () { return this._breastHorizontalPosition }
  /** 乳房尖锐度 @type {Number} */ get breastSharpness () { return this._breastSharpness }
  /** 乳房体积垂直位移 @type {Number} */ get breastVolumeVerticalPosition () { return this._breastVolumeVerticalPosition }
  /** 乳头尺寸 @type {Number} */ get breastNippleSize () { return this._breastNippleSize }
  /** 乳晕大小 @type {Number} */ get breastNipplePoint () { return this._breastNipplePoint }

  get noseMoveVertically () { return this._noseMoveVertically }
  get noseMoveHorizontally () { return this._noseMoveHorizontally }
  get noseMoveDepth () { return this._noseMoveDepth }
  get noseScaleVertically () { return this._noseScaleVertically }
  get noseScaleHorizontally () { return this._noseScaleHorizontally }
  get noseScaleDepth () { return this._noseScaleDepth }
  get noseScaleNostrilsWidth () { return this._noseScaleNostrilsWidth }
  get noseScaleTipWidth () { return this._noseScaleTipWidth }
  get noseMoveBaseVertically () { return this._noseMoveBaseVertically }
  get noseScaleWidth0 () { return this._noseScaleWidth0 }
  get noseScaleWidth1 () { return this._noseScaleWidth1 }
  get noseScaleWidth2 () { return this._noseScaleWidth2 }
  get noseCompression () { return this._noseCompression }
  get noseCurve () { return this._noseCurve }
  get noseGreek () { return this._noseGreek }
  get noseHump () { return this._noseHump }
  get noseVolume () { return this._noseVolume }
  get noseNostrilsAngle () { return this._noseNostrilsAngle }
  get noseMoveTipVertically () { return this._noseMoveTipVertically }
  get noseSeptumAngle () { return this._noseSeptumAngle }
  get noseScaleNostrilsFlaring () { return this._noseScaleNostrilsFlaring }

  get mouseScaleVertically () { return this._mouseScaleVertically }
  get mouseScaleHorizontally () { return this._mouseScaleHorizontally }
  get mouseScaleDepth () { return this._mouseScaleDepth }
  get mouseMoveVertically () { return this._mouseMoveVertically }
  get mouseMoveHorizontally () { return this._mouseMoveHorizontally }
  get mouseMoveDepth () { return this._mouseMoveDepth }
  get mouseScaleLowerlipHeight () { return this._mouseScaleLowerlipHeight }
  get mouseScaleLowerlipWidth () { return this._mouseScaleLowerlipWidth }
  get mouseScaleUpperlipHeight () { return this._mouseScaleUpperlipHeight }
  get mouseScaleUpperlipWidth () { return this._mouseScaleUpperlipWidth }
  get mouseCupidsBowWidth () { return this._mouseCupidsBowWidth }
  get mouseDimples () { return this._mouseDimples }
  get mouseLaughLines () { return this._mouseLaughLines }
  get mouseLowerlipCurvedShape () { return this._mouseLowerlipCurvedShape }
  get mouseMoveCornersVertically () { return this._mouseMoveCornersVertically }
  get mouseScaleMiddleLowerlip () { return this._mouseScaleMiddleLowerlip }
  get mouseScaleLowerlipVolume () { return this._mouseScaleLowerlipVolume }
  get mouseScalePhiltrumVolume () { return this._mouseScalePhiltrumVolume }
  get mouseScaleUpperlipVolume () { return this._mouseScaleUpperlipVolume }
  get mouseUpperlipCurvedShape () { return this._mouseUpperlipCurvedShape }
  get mouseScaleMiddleUpperlip () { return this._mouseScaleMiddleUpperlip }
  get mouseCupidsBowShape () { return this._mouseCupidsBowShape }

  get earMoveDepth () { return this._earMoveDepth }
  get earMoveHorizontally () { return this._earMoveHorizontally }
  get earMoveVertically () { return this._earMoveVertically }
  get earScale () { return this._earScale }
  get earScaleHeight () { return this._earScaleHeight }
  get earScaleLobe () { return this._earScaleLobe }
  get earRatation () { return this._earRatation }
  get earShape () { return this._earShape }
  get earWingShaped () { return this._earWingShaped }
  get earFlapped () { return this._earFlapped }

  get chinToneOfSide () { return this._chinToneOfSide }
  get chinCLeft () { return this._chinCLeft }
  get chinScaleProminence () { return this._chinScaleProminence }
  get chinScaleWidth () { return this._chinScaleWidth }
  get chinScaleHeight () { return this._chinScaleHeight }
  get chinScaleAngular () { return this._chinScaleAngular }
  get chinScalePrognathism () { return this._chinScalePrognathism }

  get cheekOuterVolume () { return this._cheekOuterVolume }
  get cheekScaleProminence () { return this._cheekScaleProminence }
  get cheekInnerVolume () { return this._cheekInnerVolume }
  get cheekMoveVertically () { return this._cheekMoveVertically }

  get torsoScaleDepth () { return this._torsoScaleDepth }
  get torsoScaleHorizontally () { return this._torsoScaleHorizontally }
  get torsoScaleVertically () { return this._torsoScaleVertically }
  get torsoMoveHorizontally () { return this._torsoMoveHorizontally }
  get torsoMoveVertically () { return this._torsoMoveVertically }
  get torsoMoveDepth () { return this._torsoMoveDepth }
  get torsoConeScale () { return this._torsoConeScale }
  get torsoDrosiMuscle () { return this._torsoDrosiMuscle }
  get torsoPectoralMuscle () { return this._torsoPectoralMuscle }
  get torsoHipScaleDepth () { return this._torsoHipScaleDepth }
  get torsoHipScaleHorizontally () { return this._torsoHipScaleHorizontally }
  get torsoHipScaleVertically () { return this._torsoHipScaleVertically }
  get torsoHipMoveHorizontally () { return this._torsoHipMoveHorizontally }
  get torsoHipMoveVertically () { return this._torsoHipMoveVertically }
  get torsoHipMoveDepth () { return this._torsoHipMoveDepth }
  get torsoWaistVertically () { return this._torsoWaistVertically }
  get torsoStomachMuscular () { return this._torsoStomachMuscular }
  get torsoStomachPregnancy () { return this._torsoStomachPregnancy }
  get torsoStomachNavieBump () { return this._torsoStomachNavieBump }
  get torsoStomachNaviePosition () { return this._torsoStomachNaviePosition }
  get torsoButtocksVolume () { return this._torsoButtocksVolume }
  get torsoPelvisMuscular () { return this._torsoPelvisMuscular }
  get torsoGenitalVolume () { return this._torsoGenitalVolume }

  get armsLowerarmThinckness () { return this._armsLowerarmThinckness }
  get armsLowerarmLength () { return this._armsLowerarmLength }
  get armsLowerarmSinnyFat () { return this._armsLowerarmSinnyFat }
  get armsLowerarmMuscles () { return this._armsLowerarmMuscles }
  get armsUpperarmThinckness () { return this._armsUpperarmThinckness }
  get armsUpperarmlength () { return this._armsUpperarmlength }
  get armsUpperarmSinnyFat () { return this._armsUpperarmSinnyFat }
  get armsUpperarmMuscles () { return this._armsUpperarmMuscles }

  get handFingersDistence () { return this._handFingersDistence }
  get handFingersDiameter () { return this._handFingersDiameter }
  get handFingerslength () { return this._handFingerslength }
  get handScale () { return this._handScale }
  get handPosition () { return this._handPosition }

  get fingernailLength () { return this._fingernailLength }

  get legsUpperlegsHeight () { return this._legsUpperlegsHeight }
  get legsLowerlegsHeight () { return this._legsLowerlegsHeight }
  get legsKneeMoveHorizontally () { return this._legsKneeMoveHorizontally }
  get legsKneeMoveVertically () { return this._legsKneeMoveVertically }
  get legsLowerlegsScaleDepth () { return this._legsLowerlegsScaleDepth }
  get legsLowerlegsHorizontally () { return this._legsLowerlegsHorizontally }
  get legsLowerlegsSinnyFat () { return this._legsLowerlegsSinnyFat }
  get legsLowerlegsMuscles () { return this._legsLowerlegsMuscles }
  get legsUpperlegsScaleDepth () { return this._legsUpperlegsScaleDepth }
  get legsUpperlegsHorizontally () { return this._legsUpperlegsHorizontally }
  get legsUpperlegsSinnyFat () { return this._legsUpperlegsSinnyFat }
  get legsUpperlegsMuscles () { return this._legsUpperlegsMuscles }

  get tailLength () { return this._tailLength }
  get tailWidth () { return this._tailWidth }

  /** 基因重组 */
  recombination () {

  }
}
