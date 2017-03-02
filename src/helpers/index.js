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

exports.css = function (element, styleName) {
  return window.getComputedStyle(element)[styleName];
}

exports.getRangeNode = function() {
    var selection = window.getSelection ? window.getSelection() :
                    document.getSelection ? document.getSelection() : '';
    if (selection.toString().length === 0) {
      return null;
    } else {
      return selection.getRangeAt(0).commonAncestorContainer;
    }
}

exports.getDeltaFromEvent = function(e) {
    let deltaX = e.deltaX;
    let deltaY = -1 * e.deltaY;

    if (typeof deltaX === "undefined" || typeof deltaY === "undefined") {
      // OS X Safari
      deltaX = -1 * e.wheelDeltaX / 6;
      deltaY = e.wheelDeltaY / 6;
    }

    if (e.deltaMode && e.deltaMode === 1) {
      // Firefox in deltaMode 1: Line scrolling
      deltaX *= 10;
      deltaY *= 10;
    }

    if (deltaX !== deltaX && deltaY !== deltaY/* NaN checks */) {
      // IE in some mouse drivers
      deltaX = 0;
      deltaY = e.wheelDelta;
    }

    if (e.shiftKey) {
      // reverse axis with shift key
      return [-deltaY, -deltaX];
    }
    return [deltaX, deltaY];
}

exports.shouldScrollUsedByChild = function(element, deltaX, deltaY) {
    let child = element.querySelector('textarea:hover, select[multiple]:hover, .ps-child:hover'),
        maxScrollTop,
        maxScrollLeft;

    if (child) {

      if (!window.getComputedStyle(child).overflow.match(/(scroll|auto)/)) {
        return false;
      }

      maxScrollTop  = child.scrollHeight - child.clientHeight;
      maxScrollLeft = child.scrollLeft - child.clientWidth;

      if (maxScrollTop > 0) {
        if (!(child.scrollTop === 0 && deltaY > 0) && !(child.scrollTop === maxScrollTop && deltaY < 0)) {
          return true;
        }
      }
      if (maxScrollLeft > 0) {
        if (!(child.scrollLeft === 0 && deltaX < 0) && !(child.scrollLeft === maxScrollLeft && deltaX > 0)) {
          return true;
        }
      }
    }
    return false;
}