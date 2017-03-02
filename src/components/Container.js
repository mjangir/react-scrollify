import React from 'react';
import ReactDOM from 'react-dom';
import styles from './css/style.css';
import HorizontalRail from './HorizontalRail';
import VerticalRail from './VerticalRail';
import _ from '../helpers';

class Container extends React.Component {

    constructor(props) {
        super(props);
        this.element = null;
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
            lastTop : null
        };

        this.selectionParams = {
          isContentSelected : false
        };

        this.scrollParams = {
          scrollDifference : {
            left  : 0,
            top   : 0
          },
          scrollingLoop : null
        };

        this.globals = {
          shouldPrevent : false
        };

        this.updatePostMountMetaProps   = this.updatePostMountMetaProps.bind(this);
        this.updateState            = this.updateState.bind(this);
        this.getScrollThumbSize     = this.getScrollThumbSize.bind(this);
        this.updateContainerScroll  = this.updateContainerScroll.bind(this);
        this.updateGeometry         = this.updateGeometry.bind(this);
        this.handleOnNativeScroll   = this.handleOnNativeScroll.bind(this);
        this.setContainerState      = this.setContainerState.bind(this);

        // Scroll when text or other content in container is selected by
        // mouse or keyboard
        this.handleSelectionChange  = this.handleSelectionChange.bind(this);
        this.handleSelectionMouseUp = this.handleSelectionMouseUp.bind(this);
        this.handleSelectionKeyUp   = this.handleSelectionKeyUp.bind(this);
        this.handleWindowMouseMove  = this.handleWindowMouseMove.bind(this);
        this.startScrolling         = this.startScrolling.bind(this);
        this.stopScrolling          = this.stopScrolling.bind(this);

        // Handle scroll with mouse wheel in the container
        this.handleMouseWheelOnContainer      = this.handleMouseWheelOnContainer.bind(this);
        this.shouldPreventDefaultOnWheel   = this.shouldPreventDefaultOnWheel.bind(this);
    }

    /**
     * Get scrollbar thumb size
     *
     * @param  {Integer|Float} thumbSize
     * @return {Integer|Float} thumbSize
     */
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

    /**
     * Bind events for mouse wheel and content selection scroll handling
     *
     * @return {*}
     */
    bindPostMountEvents() {

        if (typeof window.onwheel !== "undefined") {
            window.addEventListener('wheel', this.handleMouseWheelOnContainer);
        } else if (typeof window.onmousewheel !== "undefined") {
            window.addEventListener('mousewheel', this.handleMouseWheelOnContainer);
        }

        this.metaProps.ownerDocument.addEventListener('selectionchange', this.handleSelectionChange);
        window.addEventListener('mouseup', this.handleSelectionMouseUp);
        window.addEventListener('mousemove', this.handleWindowMouseMove);
        window.addEventListener('keyup', this.handleSelectionKeyUp);
    }

    /**
     * Update post mount meta properties of the component
     *
     * @return {*}
     */
    updatePostMountMetaProps() {
        const mainElement       = ReactDOM.findDOMNode(this);
        const horizontalRail    = ReactDOM.findDOMNode(this.refs.xrail);
        const horizontalBar     = ReactDOM.findDOMNode(this.refs.xbar);
        const verticalRail      = ReactDOM.findDOMNode(this.refs.yrail);
        const verticalBar       = ReactDOM.findDOMNode(this.refs.ybar);
        let mp                  = this.metaProps;

        this.element = mainElement;

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

    /**
     * Component Did Mount
     *
     * @return {*}
     */
    componentDidMount() {
        this.updatePostMountMetaProps();
        this.bindPostMountEvents();
        this.updateGeometry();
        setTimeout(function() {this.updateState()}.bind(this), 1000);
    }

    /**
     * Handle Native Scrolling
     *
     * @return {*}
     */
    handleOnNativeScroll() {
        this.updateGeometry();
        this.updateState();
    }

    /**
     * Set component state from child comps
     *
     * @param {Object} state
     * @return {*}
     */
    setContainerState(state) {
        this.setState(state);
    }

    /**
     * Update scroll rails and bar's geometry
     *
     * @return {*}
     */
    updateGeometry() {
        const element  = this.element;
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
    }

    /**
     * Update the actual element scrollbar and emit events
     *
     * @param  {String} axis  left|top
     * @param  {Integer} value
     * @return {*}
     */
    updateContainerScroll(axis, value) {
        const element = this.element;
        let metaProps = this.metaProps;

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

        if (!metaProps.lastTop) {
            metaProps.lastTop = element.scrollTop;
        }

        if (!metaProps.lastLeft) {
            metaProps.lastLeft = element.scrollLeft;
        }

        if (axis === 'top' && value < metaProps.lastTop) {
            this.props.onScrollUp.call(this);
        }

        if (axis === 'top' && value > metaProps.lastTop) {
            this.props.onScrollDown.call(this);
        }

        if (axis === 'left' && value < metaProps.lastLeft) {
            this.props.onScrollLeft.call(this);
        }

        if (axis === 'left' && value > metaProps.lastLeft) {
            this.props.onScrollRight.call(this);
        }

        if (axis === 'top') {
            element.scrollTop = metaProps.lastTop = value;
            this.props.onScrollY.call(this);
        }

        if (axis === 'left') {
            element.scrollLeft = metaProps.lastLeft = value;
            this.props.onScrollX.call(this);
        }
    }

    /**
     * Update the actual state to re-render the entire component tree
     *
     * @return {*}
     */
    updateState() {
        const mp      = this.metaProps;
        const element = ReactDOM.findDOMNode(this);
        let ns        = {};

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

        ns['verticalRailHeight']  = mp.verticalRailHeight;
        ns['verticalRailTop']     = element.scrollTop;

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

        ns['horizontalBarLeft']   = mp.horizontalBarLeft;
        ns['horizontalBarWidth']  = mp.horizontalBarWidth - mp.horizontalRailBorderWidth;
        ns['verticalBarTop']      = mp.verticalBarTop;
        ns['verticalBarHeight']   = mp.verticalBarHeight - mp.verticalRailBorderWidth;

        this.setState({
            scrollBarXActive        : mp.scrollBarXActive,
            scrollBarYActive        : mp.scrollBarYActive,
            isVerticalBarUsingRight : mp.isVerticalBarUsingRight,
            isHorizontalBarUsingBottom: mp.isHorizontalBarUsingBottom,
            ...ns
        });
    }

    /**
     * Mouse and Keyboard Event Handling Functions
     */

    /**
     * Handle selection change from mouse or keyboard
     *
     * @return {*}
     */
    handleSelectionChange() {
      let isContentSelected = this.selectionParams.isContentSelected;

      if (this.element.contains(_.getRangeNode())) {
        isContentSelected = true;
      } else {
        isContentSelected = false;
        this.stopScrolling();
      }
    }

    /**
     * Handle key up when content is already selected
     *
     * @return {*}
     */
    handleSelectionKeyUp() {
      let isContentSelected = this.selectionParams.isContentSelected;

      if (isContentSelected) {
        isContentSelected = false;
        this.stopScrolling();
      }
    }

    /**
     * Handle mouse up when content is already selected
     *
     * @return {*}
     */
    handleSelectionMouseUp() {
      let isContentSelected = this.selectionParams.isContentSelected;

      if (isContentSelected) {
        isContentSelected = false;
        this.stopScrolling();
      }
    }

    /**
     * Handle mouse move on window when text or any content is selected
     * in the given container
     *
     * @param  {Object} e
     * @return {*}
     */
    handleWindowMouseMove(e) {
      const element           = this.element;
      const isContentSelected = this.selectionParams.isContentSelected;

      let scrollDifference = this.scrollParams.scrollDifference,
          mousePosition,
          containerGeometry;

      if (isContentSelected) {
          mousePosition = {
              x: e.pageX,
              y: e.pageY
          };
          containerGeometry = {
              left    : element.offsetLeft,
              right   : element.offsetLeft + element.offsetWidth,
              top     : element.offsetTop,
              bottom  : element.offsetTop + element.offsetHeight
          };

          if (mousePosition.x < containerGeometry.left + 3) {
              scrollDifference.left = -5;
          } else if (mousePosition.x > containerGeometry.right - 3) {
              scrollDifference.left = 5;
          } else {
              scrollDifference.left = 0;
          }

          if (mousePosition.y < containerGeometry.top + 3) {
              if (containerGeometry.top + 3 - mousePosition.y < 5) {
                  scrollDifference.top = -5;
              } else {
                  scrollDifference.top = -20;
              }
          } else if (mousePosition.x > containerGeometry.right - 3) {
              if (mousePosition.y - containerGeometry.bottom + 3 < 5) {
                  scrollDifference.top = 5;
              } else {
                  scrollDifference.top = 20;
              }
          } else {
              scrollDifference.left = 0;
          }

          if (scrollDifference.top === 0 && scrollDifference.left === 0) {
              this.stopScrolling();
          } else {
              this.startScrolling();
          }
      }
    }

    /**
     * Start scrolling and update the actual scroll and geometry
     * according to the scrollDifference
     *
     * @return {*}
     */
    startScrolling() {
      const element           = this.element;
      let scrollingLoop       = this.scrollParams.scrollingLoop,
          scrollDifference    = this.scrollParams.scrollDifference,
          top,
          left;

      if (!scrollingLoop) {
          scrollingLoop = setInterval(function () {
              if (!element) {
                  clearInterval(scrollingLoop);
                  return;
              }
              top     = element.scrollTop + scrollDifference.top;
              left    = element.scrollLeft + scrollDifference.left;

              this.updateContainerScroll('top', top);
              this.updateContainerScroll('left', left);
              this.updateGeometry();
          }.bind(this), 50);
      }
    }

    /**
     * Stop scrolling and reset the scrollingLoop interval
     *
     * @return {*}
     */
    stopScrolling() {
      let scrollingLoop = this.scrollParams.scrollingLoop;

      if (scrollingLoop) {
          clearInterval(scrollingLoop);
          scrollingLoop = null;
      }
    }

    /**
     * Should prevent default scrollbar when scrolling with mouse
     * wheel
     *
     * @param  {Integer|Float} deltaX
     * @param  {Integer|Float} deltaY
     * @return {Boolean}
     */
    shouldPreventDefaultOnWheel(deltaX, deltaY) {
      const element       = this.element;
      const props         = this.props;
      const metaProps     = this.metaProps;
      const scrollTop     = element.scrollTop;
      const scrollLeft    = element.scrollLeft;

      if (deltaX === 0) {
          if (metaProps.scrollBarYActive) {
              return false;
          }
          if ((scrollTop === 0 && deltaY > 0) || (scrollTop >= metaProps.contentHeight - metaProps.containerHeight && deltaY < 0)) {
              return !props.wheelPropagation;
          }
      }

      if (deltaY === 0) {
          if (metaProps.scrollbarXActive) {
              return false;
          }
          if ((scrollLeft === 0 && deltaX < 0) || (scrollLeft >= metaProps.contentWidth - metaProps.containerWidth && deltaX > 0)) {
              return !props.wheelPropagation;
          }
      }
      return true;
    }

    /**
     * Handle mouse wheel movement on container
     *
     * @param  {Object} e
     * @return {*}
     */
    handleMouseWheelOnContainer(e) {
      const delta     = _.getDeltaFromEvent(e);
      const deltaX    = delta[0];
      const deltaY    = delta[1];
      const element   = this.element;
      let globals     = this.globals,
          newTop,
          newLeft;

      if (_.shouldScrollUsedByChild(element, deltaX, deltaY)) {
        return;
      }

      if (!this.props.useBothWheelAxes) {
          newTop  = element.scrollTop - (deltaY * this.props.wheelSpeed);
          newLeft = element.scrollLeft + (deltaX * this.props.wheelSpeed);
          this.updateContainerScroll('top', newTop);
          this.updateContainerScroll('left', newLeft);
      } else if (this.state.scrollbarYActive && !this.state.scrollbarXActive) {
          if (deltaY) {
              this.updateContainerScroll('top', element.scrollTop - (deltaY * this.props.wheelSpeed));
          } else {
              this.updateContainerScroll('top', element.scrollTop + (deltaX * this.props.wheelSpeed));
          }
          globals.shouldPrevent = true;
      } else if (this.state.scrollbarXActive && !this.state.scrollbarYActive) {
          if (deltaX) {
              this.updateContainerScroll('left', element.scrollLeft + (deltaX * this.props.wheelSpeed));
          } else {
              this.updateContainerScroll('left', element.scrollLeft - (deltaY * this.props.wheelSpeed));
          }
          globals.shouldPrevent = true;
      }

      this.updateGeometry();
      this.updateState();

      globals.shouldPrevent = (globals.shouldPrevent || this.shouldPreventDefaultOnWheel(deltaX, deltaY));
      if (globals.shouldPrevent) {
          e.stopPropagation();
          e.preventDefault();
      }
    }

    /**
     * Render the entire component
     *
     * @return {JSX}
     */
    render() {
        const containerStyle = {
            width       : this.props.width + 'px',
            height      : this.props.height + 'px',
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

            <div
              ref="main"
              style={containerStyle}
              className={containerClasses}
              onScroll={this.handleOnNativeScroll}
            >
                <div>
                    {this.props.children}
                </div>
                <HorizontalRail
                  ref="xrail"
                  {...this.state}
                  {...this.metaProps}
                  updateContainerScroll={this.updateContainerScroll}
                  updateGeometry={this.updateGeometry}
                  setContainerState={this.setContainerState}
                  updateState={this.updateState}
                />
                <VerticalRail
                  ref="yrail"
                  {...this.state}
                  {...this.metaProps}
                  updateContainerScroll={this.updateContainerScroll}
                  updateGeometry={this.updateGeometry}
                  setContainerState={this.setContainerState}
                  updateState={this.updateState}
                />
            </div>
        );
    }
}

Container.defaultProps = {
    containerClass          : '',
    width                   : 200,
    height                  : 200,
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