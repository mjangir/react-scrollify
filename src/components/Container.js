import React from 'react';
import ReactDOM from 'react-dom';
import styles from './css/style.css';
import HorizontalRail from './HorizontalRail';
import VerticalRail from './VerticalRail';
import _ from '../helpers';

class Container extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            horizontalBarDragging   : false,
            verticalBarDragging     : false,
            scrollBarXActive        : false,
            scrollBarYActive        : false,
            horizontalRailWidth     : 0,
            horizontalRailLeft      : 0,
            horizontalRailTop       : 0,
            horizontalRailBottom    : 0,
            horizontalBarWidth      : 0,
            horizontalBarLeft       : 0,
            verticalRailHeight      : 0,
            verticalRailTop         : 0,
            verticalRailLeft        : 0,
            verticalRailRight       : 0,
            verticalBarHeight       : 0,
            verticalBarTop          : 0,
            isVerticalBarUsingRight : false,
            isHorizontalBarUsingBottom : false,
        };

        this.metaProps = {
            shouldPrevent               :false,
            scrollBarXActive            : false,
            scrollBarYActive            : false,
            containerWidth              : null,
            containerHeight             : null,
            contentWidth                : null,
            contentHeight               : null,
            isRtl                       : false,
            isNegativeScroll            : false,
            negativeScrollAdjustment    : 0,
            ownerDocument               : document,

            horizontalBarWidth          : null,
            horizontalBarLeft           : null,
            horizontalBarTop            : null,
            horizontalBarBottom         : null,
            isHorizontalBarUsingBottom  : false,
            horizontalRailWidth         : null,
            horizontalRailRatio         : null,
            horizontalRailBorderWidth   : null,
            horizontalRailMarginWidth   : null,

            verticalBarHeight           : null,
            verticalBarTop              : null,
            verticalBarRight            : null,
            isVerticalBarUsingRight     : false,
            verticalBarLeft             : null,
            verticalBarOuterWidth       : null,
            verticalRailHeight          : null,
            verticalRailRatio           : null,
            verticalRailBorderWidth     : null,
            verticalRailMarginHeight    : null,

            lastLeft : null,
            lastTop : null,
            scrollingLoop : null,
            scrollDiff: {top: 0, left: 0},
            isSelected: false
        };

        this.updatePostMountMetaProps   = this.updatePostMountMetaProps.bind(this);
        this.updateState            = this.updateState.bind(this);
        this.getScrollThumbSize     = this.getScrollThumbSize.bind(this);
        this.updateContainerScroll  = this.updateContainerScroll.bind(this);
        this.updateGeometry         = this.updateGeometry.bind(this);
        this.handleOnNativeScroll   = this.handleOnNativeScroll.bind(this);
        this.setContainerState      = this.setContainerState.bind(this);
        this.mousewheelHandler      = this.mousewheelHandler.bind(this);
        this.getDeltaFromEvent      = this.getDeltaFromEvent.bind(this);
        this.shouldBeConsumedByChild= this.shouldBeConsumedByChild.bind(this);
        this.shouldPreventDefault   = this.shouldPreventDefault.bind(this);
        this.getRangeNode           = this.getRangeNode.bind(this);
        this.startScrolling         = this.startScrolling.bind(this);
        this.stopScrolling          = this.stopScrolling.bind(this);
        this.windowMouseMoveHandler = this.windowMouseMoveHandler.bind(this);
    }


    getRangeNode() {
        var selection = window.getSelection ? window.getSelection() :
                        document.getSelection ? document.getSelection() : '';
        if (selection.toString().length === 0) {
          return null;
        } else {
          return selection.getRangeAt(0).commonAncestorContainer;
        }
    }

    startScrolling() {
        const element = ReactDOM.findDOMNode(this);
        if (!this.metaProps.scrollingLoop) {
          this.metaProps.scrollingLoop = setInterval(function () {
            if (!element) {
              clearInterval(this.metaProps.scrollingLoop);
              return;
            }

            this.updateContainerScroll('top', element.scrollTop + this.metaProps.scrollDiff.top);
            this.updateContainerScroll('left', element.scrollLeft + this.metaProps.scrollDiff.left);
            this.updateGeometry();
          }.bind(this), 50); // every .1 sec
        }
    }

    stopScrolling() {
        if (this.metaProps.scrollingLoop) {
          clearInterval(this.metaProps.scrollingLoop);
          this.metaProps.scrollingLoop = null;
        }
    }

    updatePostMountMetaProps(elements) {
        const {mainElement,horizontalRail,horizontalBar,verticalRail,verticalBar} = elements;

        let mp   = this.metaProps;

        mp.isRtl                         = (_.css(mainElement, 'direction')) === "rtl";
        mp.horizontalBarBottom           = _.toInt(_.css(horizontalRail, 'bottom'));
        mp.isHorizontalBarUsingBottom    = mp.horizontalBarBottom === mp.horizontalBarBottom; // !isNaN
        mp.horizontalBarTop              = mp.isHorizontalBarUsingBottom ? null : _.toInt(_.css(horizontalRail, 'top'));
        mp.horizontalRailBorderWidth     = _.toInt(_.css(horizontalRail, 'borderLeftWidth')) + _.toInt(_.css(horizontalRail, 'borderRightWidth'));
        mp.horizontalRailMarginWidth     = _.toInt(_.css(horizontalRail, 'marginLeft')) + _.toInt(_.css(horizontalRail, 'marginRight'));

        mp.verticalBarRight              = _.toInt(_.css(verticalRail, 'right'));
        mp.isVerticalBarUsingRight       = mp.verticalBarRight === mp.verticalBarRight; // !isNaN
        mp.verticalBarLeft               = mp.isVerticalBarUsingRight ? null : _.toInt(_.css(verticalRail, 'left'));
        mp.verticalBarOuterWidth         = mp.isRtl ? _.outerWidth(verticalBar) : null;
        mp.verticalRailBorderWidth       = _.toInt(_.css(verticalRail, 'borderTopWidth')) + _.toInt(_.css(verticalRail, 'borderBottomWidth'));
        mp.verticalRailMarginHeight      = _.toInt(_.css(verticalRail, 'marginTop')) + _.toInt(_.css(verticalRail, 'marginBottom'));

        mp.containerWidth   = mainElement.clientWidth;
        mp.containerHeight  = mainElement.clientHeight;
        mp.contentWidth     = mainElement.scrollWidth;
        mp.contentHeight    = mainElement.scrollHeight;

        const isNegativeScroll = (function () {
            let originalScrollLeft = mainElement.scrollLeft;
            let result = null;
            mainElement.scrollLeft = -1;
            result = mainElement.scrollLeft < 0;
            mainElement.scrollLeft = originalScrollLeft;
            return result;
          })();
        mp.negativeScrollAdjustment  = isNegativeScroll ? mainElement.scrollWidth - mainElement.clientWidth : 0;
    }

    handleOnNativeScroll() {
        this.updateGeometry();
        this.updateState();
    }

    shouldPreventDefault(deltaX, deltaY) {
        var element = ReactDOM.findDOMNode(this);
        var mp = this.metaProps;
        var scrollTop = element.scrollTop;
        if (deltaX === 0) {
          if (!mp.scrollbarYActive) {
            return false;
          }
          if ((scrollTop === 0 && deltaY > 0) || (scrollTop >= mp.contentHeight - mp.containerHeight && deltaY < 0)) {
            return !mp.settings.wheelPropagation;
          }
        }

        var scrollLeft = element.scrollLeft;
        if (deltaY === 0) {
          if (!mp.scrollbarXActive) {
            return false;
          }
          if ((scrollLeft === 0 && deltaX < 0) || (scrollLeft >= mp.contentWidth - mp.containerWidth && deltaX > 0)) {
            return !mp.settings.wheelPropagation;
          }
        }
        return true;
      }

    shouldBeConsumedByChild(deltaX, deltaY) {
        var element = ReactDOM.findDOMNode(this);
        var child = element.querySelector('textarea:hover, select[multiple]:hover, .ps-child:hover');
        if (child) {
          if (!window.getComputedStyle(child).overflow.match(/(scroll|auto)/)) {
            // if not scrollable
            return false;
          }

          var maxScrollTop = child.scrollHeight - child.clientHeight;
          if (maxScrollTop > 0) {
            if (!(child.scrollTop === 0 && deltaY > 0) && !(child.scrollTop === maxScrollTop && deltaY < 0)) {
              return true;
            }
          }
          var maxScrollLeft = child.scrollLeft - child.clientWidth;
          if (maxScrollLeft > 0) {
            if (!(child.scrollLeft === 0 && deltaX < 0) && !(child.scrollLeft === maxScrollLeft && deltaX > 0)) {
              return true;
            }
          }
        }
        return false;
    }

    getDeltaFromEvent(e) {
        var deltaX = e.deltaX;
        var deltaY = -1 * e.deltaY;

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

    mousewheelHandler(e) {
        var delta = this.getDeltaFromEvent(e);

        var deltaX = delta[0];
        var deltaY = delta[1];

        if (this.shouldBeConsumedByChild(deltaX, deltaY)) {
          return;
        }
        var element = ReactDOM.findDOMNode(this);

        this.metaProps.shouldPrevent = false;
        if (!this.props.useBothWheelAxes) {
          // deltaX will only be used for horizontal scrolling and deltaY will
          // only be used for vertical scrolling - this is the default
          this.updateContainerScroll('top', element.scrollTop - (deltaY * this.props.wheelSpeed));
          this.updateContainerScroll('left', element.scrollLeft + (deltaX * this.props.wheelSpeed));
        } else if (i.scrollbarYActive && !i.scrollbarXActive) {
          // only vertical scrollbar is active and useBothWheelAxes option is
          // active, so let's scroll vertical bar using both mouse wheel axes
          if (deltaY) {
            this.updateContainerScroll('top', element.scrollTop - (deltaY * this.props.wheelSpeed));
          } else {
            this.updateContainerScroll('top', element.scrollTop + (deltaX * this.props.wheelSpeed));
          }
          this.metaProps.shouldPrevent = true;
        } else if (i.scrollbarXActive && !i.scrollbarYActive) {
          // useBothWheelAxes and only horizontal bar is active, so use both
          // wheel axes for horizontal bar
          if (deltaX) {
            this.updateContainerScroll('left', element.scrollLeft + (deltaX * this.props.wheelSpeed));
          } else {
            this.updateContainerScroll('left', element.scrollLeft - (deltaY * this.props.wheelSpeed));
          }
          this.metaProps.shouldPrevent = true;
        }

        this.updateGeometry();
        this.updateState();

        this.metaProps.shouldPrevent = (this.metaProps.shouldPrevent || this.shouldPreventDefault(deltaX, deltaY));
        if (this.metaProps.shouldPrevent) {
          e.stopPropagation();
          e.preventDefault();
        }
    }

    setContainerState(state) {
        this.setState(state);
    }

    componentWillMount() {

    }

    componentDidMount() {
        if (typeof window.onwheel !== "undefined") {
            window.addEventListener('wheel', this.mousewheelHandler);
        } else if (typeof window.onmousewheel !== "undefined") {
            window.addEventListener('mousewheel', this.mousewheelHandler);
        }


        this.updatePostMountMetaProps({
            mainElement       : ReactDOM.findDOMNode(this),
            horizontalRail    : ReactDOM.findDOMNode(this.refs.xrail),
            horizontalBar     : ReactDOM.findDOMNode(this.refs.xbar),
            verticalRail      : ReactDOM.findDOMNode(this.refs.yrail),
            verticalBar       : ReactDOM.findDOMNode(this.refs.ybar)
        });

        this.metaProps.ownerDocument.addEventListener('selectionchange', function () {
            if (ReactDOM.findDOMNode(this).contains(this.getRangeNode())) {
              this.metaProps.isSelected = true;
            } else {
              this.metaProps.isSelected = false;
              this.stopScrolling();
            }
          }.bind(this));

        window.addEventListener('mouseup', function () {
            if (this.metaProps.isSelected) {
              this.metaProps.isSelected = false;
              this.stopScrolling();
            }
          }.bind(this));

        window.addEventListener('mousemove', this.windowMouseMoveHandler);


        window.addEventListener('keyup', function () {
            if (this.metaProps.isSelected) {
              this.metaProps.isSelected = false;
              this.stopScrolling();
            }
          }.bind(this));

        this.updateGeometry();

        setTimeout(function() {this.updateState()}.bind(this), 1000);
    }

    windowMouseMoveHandler(e) {
        const element = ReactDOM.findDOMNode(this);
        if (this.metaProps.isSelected) {
          var mousePosition = {x: e.pageX, y: e.pageY};
          var containerGeometry = {
            left: element.offsetLeft,
            right: element.offsetLeft + element.offsetWidth,
            top: element.offsetTop,
            bottom: element.offsetTop + element.offsetHeight
          };

          if (mousePosition.x < containerGeometry.left + 3) {
            this.metaProps.scrollDiff.left = -5;
          } else if (mousePosition.x > containerGeometry.right - 3) {
            this.metaProps.scrollDiff.left = 5;
          } else {
            this.metaProps.scrollDiff.left = 0;
          }

          if (mousePosition.y < containerGeometry.top + 3) {
            if (containerGeometry.top + 3 - mousePosition.y < 5) {
              this.metaProps.scrollDiff.top = -5;
            } else {
              this.metaProps.scrollDiff.top = -20;
            }
          } else if (mousePosition.y > containerGeometry.bottom - 3) {
            if (mousePosition.y - containerGeometry.bottom + 3 < 5) {
              this.metaProps.scrollDiff.top = 5;
            } else {
              this.metaProps.scrollDiff.top = 20;
            }
          } else {
            this.metaProps.scrollDiff.top = 0;
          }

          if (this.metaProps.scrollDiff.top === 0 && this.metaProps.scrollDiff.left === 0) {
            this.stopScrolling();
          } else {
            this.startScrolling();
          }
        }
    }

    getScrollThumbSize(thumbSize) {
        const props = this.props;

        if (props.minScrollbarLength) {
            thumbSize = Math.max(thumbSize, props.minScrollbarLength);
        }
        if (props.maxScrollbarLength) {
            thumbSize = Math.min(thumbSize, props.maxScrollbarLength);
        }
        return thumbSize;
    }

    updateGeometry() {
        const element  = ReactDOM.findDOMNode(this);
        const props    = this.props;
        let mp         = this.metaProps;

        if (!props.suppressScrollX && mp.containerWidth + props.scrollXMarginOffset < mp.contentWidth) {
            mp.scrollBarXActive     = true;
            mp.horizontalRailWidth  = mp.containerWidth - mp.horizontalRailMarginWidth;
            mp.horizontalRailRatio  = mp.containerWidth / mp.horizontalRailWidth;
            mp.horizontalBarWidth   = this.getScrollThumbSize(_.toInt(mp.horizontalRailWidth * mp.containerWidth / mp.contentWidth));
            mp.horizontalBarLeft    = _.toInt((mp.negativeScrollAdjustment + element.scrollLeft) * (mp.horizontalRailWidth - mp.horizontalBarWidth) / (mp.contentWidth - mp.containerWidth));
        }

        if (!props.suppressScrollY && mp.containerHeight + props.scrollYMarginOffset < mp.contentHeight) {
            mp.scrollBarYActive     = true;
            mp.verticalRailHeight   = mp.containerHeight - mp.verticalRailMarginHeight;
            mp.verticalRailRatio    = mp.containerHeight / mp.verticalRailHeight;
            mp.verticalBarHeight    = this.getScrollThumbSize(_.toInt(mp.verticalRailHeight * mp.containerHeight / mp.contentHeight));
            mp.verticalBarTop       = _.toInt(element.scrollTop * (mp.verticalRailHeight - mp.verticalBarHeight) / (mp.contentHeight - mp.containerHeight));
        }

        if (mp.horizontalBarLeft >= mp.horizontalRailWidth - mp.horizontalBarWidth) {
            mp.horizontalBarLeft = mp.horizontalRailWidth - mp.horizontalBarWidth;
        }

        if (mp.verticalBarTop >= mp.verticalRailHeight - mp.verticalBarHeight) {
            mp.verticalBarTop = mp.verticalRailHeight - mp.verticalBarHeight;
        }

        // if(!ns.scrollbarXActive) {
        //     this.updateContainerScroll('left', 0);
        // }

        // if(!ns.scrollbarYActive) {
        //     this.updateContainerScroll('top', 0);
        // }

    }

    updateContainerScroll(axis, value) {
        let mp = this.metaProps;
        const element = ReactDOM.findDOMNode(this);

        if (typeof axis === 'undefined') {
            throw 'You must provide an axis to the update-scroll function';
        }

        if (typeof value === 'undefined') {
            throw 'You must provide a value to the update-scroll function';
        }

        if (axis === 'top' && value <= 0) {
            element.scrollTop = value = 0;
            this.props.onScrollYReachStart.call(this);
        }

        if (axis === 'left' && value <= 0) {
            element.scrollLeft = value = 0;
            this.props.onScrollXReachStart.call(this);
        }

        if (axis === 'top' && value >= this.metaProps.contentHeight - this.metaProps.containerHeight) {
            value = this.metaProps.contentHeight - this.metaProps.containerHeight;
            if (value - element.scrollTop <= 1) {
                value = element.scrollTop;
            } else {
                element.scrollTop = value;
            }
            this.props.onScrollYReachEnd.call(this);
        }

        if (axis === 'left' && value >= this.metaProps.contentWidth - this.metaProps.containerWidth) {
            value = this.metaProps.contentWidth - this.metaProps.containerWidth;
            if (value - element.scrollLeft <= 1) {
                value = element.scrollLeft;
            } else {
                element.scrollLeft = value;
            }
            this.props.onScrollXReachEnd.call(this);
        }

        if (!mp.lastTop) {
            mp.lastTop = element.scrollTop;
          }

          if (!mp.lastLeft) {
            mp.lastLeft = element.scrollLeft;
          }

          if (axis === 'top' && value < mp.lastTop) {
            //element.dispatchEvent(createDOMEvent('ps-scroll-up'));
          }

          if (axis === 'top' && value > mp.lastTop) {
            //element.dispatchEvent(createDOMEvent('ps-scroll-down'));
          }

          if (axis === 'left' && value < mp.lastLeft) {
            //element.dispatchEvent(createDOMEvent('ps-scroll-left'));
          }

          if (axis === 'left' && value > mp.lastLeft) {
            //element.dispatchEvent(createDOMEvent('ps-scroll-right'));
          }

          if (axis === 'top') {
            element.scrollTop = mp.lastTop = value;
            //element.dispatchEvent(createDOMEvent('ps-scroll-y'));
          }

          if (axis === 'left') {
            element.scrollLeft = mp.lastLeft = value;
            //element.dispatchEvent(createDOMEvent('ps-scroll-x'));
          }
    }

    updateState() {
        const mp = this.metaProps;
        const element = ReactDOM.findDOMNode(this);
        let ns = {};

        ns['horizontalRailWidth'] = mp.horizontalRailWidth;
        if(mp.isRtl) {
            ns['horizontalRailLeft'] = mp.negativeScrollAdjustment + element.scrollLeft + mp.containerWidth - mp.contentWidth;
        } else {
            ns['horizontalRailLeft'] = element.scrollLeft;
        }
        if(mp.isHorizontalBarUsingBottom) {
            ns['horizontalRailBottom'] = mp.horizontalBarBottom - element.scrollTop;
        } else {
            ns['horizontalRailTop'] = mp.horizontalBarTop + element.scrollTop;
        }

        ns['verticalRailHeight'] = mp.verticalRailHeight;
        ns['verticalRailTop'] = element.scrollTop;
        if(mp.isVerticalBarUsingRight) {
            if(mp.isRtl) {
                ns['verticalRailRight'] = mp.contentWidth - (mp.negativeScrollAdjustment + element.scrollLeft) - mp.verticalBarRight - i.verticalBarOuterWidth;
            } else {
                ns['verticalRailRight'] = mp.verticalBarRight - element.scrollLeft;
            }
        } else {
            if(mp.isRtl) {
                ns['verticalRailLeft'] = mp.negativeScrollAdjustment + element.scrollLeft + mp.containerWidth * 2 - mp.contentWidth - mp.verticalBarLeft - mp.verticalBarOuterWidth;
            } else {
                ns['verticalRailLeft'] = mp.verticalBarLeft + element.scrollLeft;
            }
        }

        ns['horizontalBarLeft'] = mp.horizontalBarLeft;
        ns['horizontalBarWidth'] = mp.horizontalBarWidth - mp.horizontalRailBorderWidth;
        ns['verticalBarTop'] = mp.verticalBarTop;
        ns['verticalBarHeight'] = mp.verticalBarHeight - mp.verticalRailBorderWidth;

        this.setState({
            scrollBarXActive        : mp.scrollBarXActive,
            scrollBarYActive        : mp.scrollBarYActive,
            isVerticalBarUsingRight : mp.isVerticalBarUsingRight,
            isHorizontalBarUsingBottom: mp.isHorizontalBarUsingBottom,
            ...ns
        });
    }

    render() {
        const containerStyle = {
            width       : this.props.width,
            height      : this.props.height,
            overflow    : 'hidden',
            position    : 'relative'
        };

        let containerClasses = ['ps-container', 'ps-theme-' + this.props.theme];

        if(this.state.scrollBarXActive) {
            containerClasses.push('ps-active-x');
        }

        if(this.state.scrollBarYActive) {
            containerClasses.push('ps-active-y');
        }

        if(this.state.horizontalBarDragging || this.state.verticalBarDragging) {
            containerClasses.push('ps-in-scrolling');
        }

        if(this.state.horizontalBarDragging) {
            containerClasses.push('ps-x');
        }

        if(this.state.verticalBarDragging) {
            containerClasses.push('ps-y');
        }

        containerClasses = containerClasses.join(' ');

        return (

            <div ref="main" style={containerStyle} className={containerClasses} onScroll={this.handleOnNativeScroll}>
                <div>
                    {this.props.children}
                </div>
                <HorizontalRail ref="xrail" {...this.state} {...this.metaProps} updateContainerScroll={this.updateContainerScroll} updateGeometry={this.updateGeometry}  setContainerState={this.setContainerState}
                updateState={this.updateState}/>
                <VerticalRail ref="yrail" {...this.state} {...this.metaProps} updateContainerScroll={this.updateContainerScroll} updateGeometry={this.updateGeometry} setContainerState={this.setContainerState} updateState={this.updateState}/>
            </div>
        );
    }
}

Container.defaultProps = {
    containerClass          : '',
    width                   : '200px',
    height                  : '200px',
    wheelSpeed              : 1,
    wheelPropagation        : false,
    swipePropagation        : false,
    minScrollbarLength      : null,
    maxScrollbarLength      : null,
    useBothWheelAxes        : false,
    suppressScrollX         : false,
    suppressScrollY         : false,
    scrollXMarginOffset     : 0,
    scrollYMarginOffset     : 0,
    theme                   : 'default',
    onScrollX               : function(){},
    onScrollY               : function(){},
    onScrollUp              : function(){},
    onScrollDown            : function(){},
    onScrollLeft            : function(){},
    onScrollRight           : function(){},
    onScrollXReachStart     : function(){},
    onScrollXReachEnd       : function(){},
    onScrollYReachStart     : function(){},
    onScrollYReachEnd       : function(){}
};

export default Container;