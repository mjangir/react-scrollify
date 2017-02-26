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
            scrollBarXActive        : false,
            scrollbarYActive        : false,

            isRtl                   : false,
            ownerDocument           : document,

            containerWidth          : null,
            containerHeight         : null,
            contentWidth            : null,
            contentHeight           : null,

            horizontalRailWidth     : null,
            horizontalRailRatio     : null,
            horizontalRailLeft      : null,
            horizontalRailTop       : null,
            horizontalRailBottom    : null,

            horizontalBarWidth      : null,
            horizontalBarLeft       : null,

            verticalRailHeight      : null,
            verticalRailTop         : null,
            verticalRailLeft        : null,
            verticalRailRight       : null,

            verticalBarHeight       : null,
            verticalBarTop          : null 
        }
        
        this.updateContainerScroll  = this.updateContainerScroll.bind(this);
        this.updateGeometry         = this.updateGeometry.bind(this);
        this.handleOnNativeScroll   = this.handleOnNativeScroll.bind(this);
        this.setContainerState      = this.setContainerState.bind(this);
    }
    
    handleOnNativeScroll() {
        this.updateGeometry();
    }
    
    setContainerState(state) {
        this.setState(state);
    }
    
    componentWillMount() {
        
    }

    componentDidMount() {
        let mainElement       = ReactDOM.findDOMNode(this);
        let horizontalRail    = ReactDOM.findDOMNode(this.refs.xrail);
        let horizontalBar     = ReactDOM.findDOMNode(this.refs.xrail.refs.bar);
        let verticalRail      = ReactDOM.findDOMNode(this.refs.yrail);
        let verticalBar       = ReactDOM.findDOMNode(this.refs.yrail.refs.bar);
        
        const isRtl                     = (mainElement.style.direction) === "rtl";
        
        const horizontalRailWidth           = 0;
        const horizontalRailRatio           = 0;
        const horizontalBarWidth            = 0;
        const horizontalBarLeft             = 0;
        const horizontalBarBottom           = _.toInt(horizontalRail.style.bottom);
        const isHorizontalBarUsingBottom    = horizontalBarBottom === horizontalBarBottom; // !isNaN
        const horizontalBarTop              = isHorizontalBarUsingBottom ? null : _.toInt(horizontalRail.style.top);
        const horizontalRailBorderWidth     = _.toInt(horizontalRail.style.borderLeftWidth) + _.toInt(horizontalRail.style.borderRightWidth);  
        horizontalRail.style.display        = 'block';
        const horizontalRailMarginWidth     = _.toInt(horizontalRail.style.marginLeft) + _.toInt(horizontalRail.style.marginRight);
        horizontalRail.style.display        = '';
        
        const verticalRailHeight            = 0;
        const verticalRailRatio             = 0;
        const verticalBarHeight             = 0;
        const verticalBarTop                = 0;
        const verticalBarRight              = _.toInt(verticalRail.style.right);
        const isVerticalBarUsingRight       = verticalBarRight === verticalBarRight; // !isNaN
        const verticalBarLeft               = isVerticalBarUsingRight ? null : _.toInt(verticalRail.style.left);
        const verticalBarOuterWidth         = isRtl ? _.outerWidth(verticalBar) : null;
        const verticalRailBorderWidth       = _.toInt(verticalRail.style.borderTopWidth) + _.toInt(verticalRail.style.borderBottomWidth);  
        verticalRail.style.display          = 'block';
        const verticalRailMarginHeight      = _.toInt(verticalRail.style.marginTop) + _.toInt(verticalRail.style.marginBottom);
        verticalRail.style.display          = '';
        
        const isNegativeScroll = (function () {
            let originalScrollLeft = mainElement.scrollLeft;
            let result = null;
            mainElement.scrollLeft = -1;
            result = mainElement.scrollLeft < 0;
            mainElement.scrollLeft = originalScrollLeft;
            return result;
          })();
        const negativeScrollAdjustment  = isNegativeScroll ? mainElement.scrollWidth - mainElement.clientWidth : 0;
        
        
        setTimeout(function() {;
            this.updateGeometry({
                isRtl,
                negativeScrollAdjustment,
                horizontalRailWidth,
                horizontalRailRatio,
                horizontalBarWidth,
                horizontalBarLeft,
                horizontalBarTop,
                isHorizontalBarUsingBottom,
                horizontalBarBottom,
                horizontalRailBorderWidth,
                horizontalRailMarginWidth,
                verticalRailHeight,
                verticalRailRatio,
                verticalBarHeight,
                verticalBarTop,
                verticalBarLeft,
                verticalBarOuterWidth,
                isVerticalBarUsingRight,
                verticalBarRight,
                verticalRailBorderWidth,
                verticalRailMarginHeight
            });
          }.bind(this), 1000);
        
        
    }
    
    updateGeometry(state) {
        const element           = ReactDOM.findDOMNode(this);
        const containerWidth    = element.clientWidth;
        const containerHeight   = element.clientHeight;
        const contentWidth      = element.scrollWidth;
        const contentHeight     = element.scrollHeight;
        const props             = this.props;
        
        const getThumbSize = function(thumbSize) {
          if (props.minScrollbarLength) {
            thumbSize = Math.max(thumbSize, props.minScrollbarLength);
          }
          if (props.maxScrollbarLength) {
            thumbSize = Math.min(thumbSize, props.maxScrollbarLength);
          }
          return thumbSize;
        }
        
        let ns = {};
        
        ns.containerWidth = containerWidth;
        ns.containerHeight = containerHeight;
        ns.contentWidth = contentWidth;
        ns.contentHeight = contentHeight;
        ns.negativeScrollAdjustment = state.negativeScrollAdjustment;
        
        if (!props.suppressScrollX && containerWidth + props.scrollXMarginOffset < contentWidth) {
            ns.scrollbarXActive     = true;
            ns.horizontalRailWidth  = containerWidth - state.horizontalRailMarginWidth;
            ns.horizontalRailRatio  = containerWidth / ns.horizontalRailWidth;
            ns.horizontalBarWidth   = getThumbSize(_.toInt(ns.horizontalRailWidth * containerWidth / contentWidth));
            ns.horizontalBarLeft    = _.toInt((state.negativeScrollAdjustment + element.scrollLeft) * (ns.horizontalRailWidth - ns.horizontalBarWidth) / (contentWidth - containerWidth));
        }
        
        if (!props.suppressScrollY && containerHeight + props.scrollYMarginOffset < contentHeight) {
            ns.scrollbarYActive     = true;
            ns.verticalRailHeight   = containerHeight - state.verticalRailMarginHeight;
            ns.verticalRailRatio    = containerHeight / ns.verticalRailHeight;
            ns.verticalBarHeight    = getThumbSize(_.toInt(ns.verticalRailHeight * containerHeight / contentHeight));
            ns.verticalBarTop       = _.toInt(element.scrollTop * (ns.verticalRailHeight - ns.verticalBarHeight) / (contentHeight - containerHeight));
        }

        if (ns.horizontalBarLeft >= ns.horizontalRailWidth - ns.horizontalBarWidth) {
            ns.horizontalBarLeft = ns.horizontalRailWidth - ns.horizontalBarWidth;
        }
        
        if (ns.verticalBarTop >= ns.verticalRailHeight - ns.verticalBarHeight) {
            ns.verticalBarTop = ns.verticalRailHeight - ns.verticalBarHeight;
        }
        
        ns.verticalRailTop = element.scrollTop;
        
        if (state.isRtl) {
            ns.horizontalRailLeft = state.negativeScrollAdjustment + element.scrollLeft + containerWidth - contentWidth;
        } else {
            ns.horizontalRailLeft = element.scrollLeft;
        }
        if (state.isHorizontalBarUsingBottom) {
            ns.horizontalRailBottom = state.horizontalBarBottom - element.scrollTop;
        } else {
            ns.horizontalRailTop = state.horizontalBarTop + element.scrollTop;
        }
        
        if (state.isVerticalBarUsingRight) {
            if (state.isRtl) {
                ns.verticalRailRight = contentWidth - (state.negativeScrollAdjustment + element.scrollLeft) - state.verticalBarRight - state.verticalBarOuterWidth;
            } else {
                ns.verticalBarRight = state.verticalBarRight - element.scrollLeft;
            }
        } else {
            if (state.isRtl) {
                ns.verticalBarLeft = state.negativeScrollAdjustment + element.scrollLeft + containerWidth * 2 - contentWidth - state.verticalBarLeft - state.verticalBarOuterWidth;
            } else {
                ns.verticalBarLeft = state.verticalBarLeft + element.scrollLeft;
            }
        }
        
        if(!ns.scrollbarXActive) {
            this.updateContainerScroll('left', 0);
        }
        
        if(!ns.scrollbarYActive) {
            this.updateContainerScroll('top', 0);
        }
        
        this.setState(ns);
        
    }
    
    updateContainerScroll(axis, value) {
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
        
        if (axis === 'top' && value >= this.state.contentHeight - this.state.containerHeight) {
            value = this.state.contentHeight - this.state.containerHeight;
            if (value - element.scrollTop <= 1) {
                value = element.scrollTop;
            } else {
                element.scrollTop = value;
            }
            this.props.onScrollYReachEnd.call(this);
        }
        
        if (axis === 'left' && value >= this.state.contentWidth - this.state.containerWidth) {
            value = this.state.contentWidth - this.state.containerWidth;
            if (value - element.scrollLeft <= 1) {
                value = element.scrollLeft;
            } else {
                element.scrollLeft = value;
            }
            this.props.onScrollXReachEnd.call(this);
        }

    }

    render() {
        const containerStyle = {
            width: this.props.width,
            height: this.props.height,
            overflow: 'hidden',
            position: 'relative'
        };
        
        let containerClasses = ['ps-container', 'ps-theme-' + this.props.theme];
        
        if(this.state.scrollbarXActive) {
            containerClasses.push('ps-active-x');
        }
        
        if(this.state.scrollbarYActive) {
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
                <HorizontalRail ref="xrail" {...this.state} setContainerState={this.setContainerState}/>
                <VerticalRail ref="yrail" {...this.state} setContainerState={this.setContainerState}/>
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