import React from 'react';
import ReactDOM from 'react-dom';
import _ from '../helpers';

class HorizontalBar extends React.Component {

    constructor(props) {
        super(props);

        this.handleOnFocus              = this.handleOnFocus.bind(this);
        this.handleOnBlur               = this.handleOnBlur.bind(this);
        this.handleOnMouseDown          = this.handleOnMouseDown.bind(this);;
        this.handleOnMouseMove          = this.handleOnMouseMove.bind(this);
        this.handleOnMouseUp            = this.handleOnMouseUp.bind(this);
        this.updateScrollAndGeometry    = this.updateScrollAndGeometry.bind(this);
    }

    componentDidMount() {

    }

    componentDidUpdate(props, state) {
        const {horizontalBarDragging, ownerDocument} = this.props;

        if (horizontalBarDragging) {
            ownerDocument.addEventListener('mousemove', this.handleOnMouseMove)
            ownerDocument.addEventListener('mouseup', this.handleOnMouseUp)
        } else if (!horizontalBarDragging) {
            ownerDocument.removeEventListener('mousemove', this.handleOnMouseMove)
            ownerDocument.removeEventListener('mouseup', this.handleOnMouseUp)
        }
    }

    handleOnFocus(e) {
        e.target.classList.add('ps--focus');
    }

    handleOnBlur(e) {
        e.target.classList.remove('ps--focus');
    }

    handleOnMouseUp(e) {
        this.props.setContainerState({
            horizontalBarDragging: false
        });
        e.stopPropagation();
        e.preventDefault();
    }

    handleOnMouseDown(e) {
        const currentPageX = e.pageX;
        const currentLeft = _.toInt(ReactDOM.findDOMNode(this).style.left) * this.props.horizontalRailRatio;

        this.props.setContainerState({
            horizontalBarDragging: true,
            currentPageX,
            currentLeft
        });

        e.stopPropagation();
        e.preventDefault();
    }

    handleOnMouseMove(e) {
        this.updateScrollAndGeometry(e.pageX - this.props.currentPageX);
    }

    updateScrollAndGeometry(deltaX) {
        const {
            currentLeft,
            horizontalRailRatio,
            horizontalRailWidth,
            horizontalBarWidth,
            horizontalBarLeft,
            contentWidth,
            containerWidth,
            negativeScrollAdjustment
        } = this.props;

        const newLeft = currentLeft + (deltaX * horizontalRailRatio);
        const maxLeft = Math.max(0, ReactDOM.findDOMNode(this).parentNode.getBoundingClientRect().left) + (horizontalRailRatio * (horizontalRailWidth - horizontalBarWidth));

        let scrollbarXLeft, scrollLeft;

        if (newLeft < 0) {
          scrollbarXLeft = 0;
        } else if (newLeft > maxLeft) {
          scrollbarXLeft = maxLeft;
        } else {
          scrollbarXLeft = newLeft;
        }

        scrollLeft = _.toInt(scrollbarXLeft * (contentWidth - containerWidth) / (containerWidth - (horizontalRailRatio * horizontalBarWidth))) - negativeScrollAdjustment;

        this.props.updateContainerScroll('left', scrollLeft);
        this.props.updateGeometry();
        this.props.updateState();
    }

    render() {
        const style = {
            width : this.props.horizontalBarWidth + 'px',
            left  : this.props.horizontalBarLeft + 'px'
        };

        return (
            <div
                ref="xbar"
                className="ps-scrollbar-x"
                tabIndex="0"
                style={style}
                onFocus={this.handleOnFocus}
                onBlur={this.handleOnBlur}
                onMouseDown={this.handleOnMouseDown}
            ></div>
        );
    }
}

export default HorizontalBar;
