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
        if(e.target !== ReactDOM.findDOMNode(this.refs.ybar)) {
            const {
            verticalBarTop,
            containerHeight
            }                   = this.props;
            const positionTop   = e.pageY - window.pageYOffset - ReactDOM.findDOMNode(this).getBoundingClientRect().top;
            const direction     = positionTop > verticalBarTop ? 1 : -1;
            const newTop        = ReactDOM.findDOMNode(this).parentNode.scrollTop + direction * containerHeight;
            this.updateScrollAndGeometry(newTop);
        }


        e.stopPropagation();
    }

    updateScrollAndGeometry(newTop) {
        // this.props.updateContainerScroll('top', newTop);
        // this.props.updateGeometry();
        // this.props.updateState();
    }

    render() {
        const style = {
                height    : this.props.verticalRailHeight + 'px',
                top       : this.props.verticalRailTop + 'px'
        };
        if(this.props.isVerticalBarUsingRight) {
            style['right'] = this.props.verticalRailRight + 'px';
        } else {
            style['left'] = this.props.verticalRailLeft + 'px';
        }

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
