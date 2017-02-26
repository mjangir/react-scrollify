import React from 'react';
import ReactDOM from 'react-dom';
import _ from '../helpers';

class VerticalBar extends React.Component {

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
        const {verticalBarDragging, ownerDocument} = this.props;
        
        if (verticalBarDragging) {
            ownerDocument.addEventListener('mousemove', this.handleOnMouseMove)
            ownerDocument.addEventListener('mouseup', this.handleOnMouseUp)
        } else if (!verticalBarDragging) {
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
            verticalBarDragging: false
        });
        e.stopPropagation();
        e.preventDefault();
    }
    
    handleOnMouseDown(e) {
        const currentPageY  = e.pageY;
        const currentTop    = _.toInt(ReactDOM.findDOMNode(this).style.top) * this.props.verticalRailRatio;
        
        this.props.setContainerState({
            verticalBarDragging: true,
            currentPageY,
            currentTop
        });

        e.stopPropagation();
        e.preventDefault();
    }
    
    handleOnMouseMove(e) {
        this.updateScrollAndGeometry(e.pageY - this.props.currentPageY);
    }
    
    updateScrollAndGeometry(deltaY) {
        const {
            currentTop, 
            verticalRailRatio, 
            verticalRailHeight, 
            verticalBarHeight, 
            verticalBarTop, 
            contentHeight, 
            containerHeight, 
            negativeScrollAdjustment
        } = this.props;
        
        const newTop = currentTop + (deltaY * verticalRailRatio);
        const maxTop = Math.max(0, ReactDOM.findDOMNode(this).parentNode.getBoundingClientRect().top) + (verticalRailRatio * (verticalRailHeight - verticalBarHeight));
        
        let scrollbarYTop, scrollTop;
        
        if (newTop < 0) {
            scrollbarYTop = 0;
        } else if (newTop > maxTop) {
            scrollbarYTop = maxTop;
        } else {
            scrollbarYTop = newTop;
        }

        scrollTop = _.toInt(scrollbarYTop * (contentHeight - containerHeight) / (containerHeight - (verticalRailRatio * verticalBarHeight)));
    }

    render() {
        const style = {
            height    : this.props.verticalBarHeight + 'px',
            top       : this.props.verticalBarTop + 'px'
        };
      
      return (
          <div 
            ref="bar" 
            className="ps-scrollbar-y" 
            tabIndex="0" 
            style={style} 
            onFocus={this.handleOnFocus} 
            onBlur={this.handleOnBlur}
            onMouseDown={this.handleOnMouseDown}
        ></div>
      );
    }
}

export default VerticalBar;
