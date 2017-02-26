const toInt = exports.toInt = function (x) {
  return parseInt(x, 10) || 0;
};

exports.outerWidth = function(element) {
    return toInt(element.style.width) +
         toInt(element.style.paddingLeft) +
         toInt(element.style.paddingRight) +
         toInt(element.style.borderLeftWidth) +
         toInt(element.style.borderRightWidth);
}