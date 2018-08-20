export default {
  isUnaryTag(tagName) {
    return 'area,br,hr,img,input'.split(',').filter(item => item === tagName).length > 0
  }
}