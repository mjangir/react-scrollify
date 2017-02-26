import React from 'react';
import ReactDOM from 'react-dom';
import _ from '../helpers';
import VerticalBar from './VerticalBar';

class VerticalRail extends React.Component {

    constructor(props) {
        super(props);
        this.handleOnClick           = this.handleOnClick.bind(this);
        this.updateScrollAndGeometry = this.updateScrollAndGeometry.bind(this);
    }

    componentDidMount() {
    
    }
    
    handleOnClick(e) {
        const {
            verticalBarTop, 
            containerHeight
        }                   = this.props;
        const positionTop   = e.pageY - window.pageYOffset - ReactDOM.findDOMNode(this).getBoundingClientRect().top;
        const direction     = positionTop > verticalBarTop ? 1 : -1;
        const newTop        = ReactDOM.findDOMNode(this).parentNode.scrollTop + direction * containerHeight;
        
        this.updateScrollAndGeometry(newTop);
        
        e.stopPropagation();
    }
    
    updateScrollAndGeometry(newTop) {
        console.log(newTop);
    }

    render() {
        const style = {
                height    : this.props.verticalRailHeight + 'px',
                top       : this.props.verticalRailTop + 'px',
                left      : this.props.verticalRailLeft + 'px',
                right     : this.props.verticalRailRight + 'px'
        };
        
        return (
            <div 
                className="ps-scrollbar-y-rail" 
                style={style} 
                onClick={this.handleOnClick}
            >
                <VerticalBar {...this.props}/>
            </div>
        );
  }
}

export default VerticalRail;
