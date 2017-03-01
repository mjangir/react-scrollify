import React from 'react';
import ReactDOM from 'react-dom';
import _ from '../helpers';
import HorizontalBar from './HorizontalBar';


class HorizontalRail extends React.Component {

    constructor(props) {
        super(props);
        this.handleOnClick           = this.handleOnClick.bind(this);
        this.updateScrollAndGeometry = this.updateScrollAndGeometry.bind(this);
    }

    componentDidMount() {

    }

    handleOnClick(e) {
        const {
            horizontalBarLeft,
            containerWidth
        }                   = this.props;
        const positionLeft  = e.pageX - window.pageXOffset - ReactDOM.findDOMNode(this).getBoundingClientRect().left;
        const direction     = positionLeft > horizontalBarLeft ? 1 : -1;
        const newLeft       = ReactDOM.findDOMNode(this).parentNode.scrollLeft + direction * containerWidth;

        this.updateScrollAndGeometry(newLeft);

        e.stopPropagation();
    }

    updateScrollAndGeometry(newLeft) {
        // this.props.updateContainerScroll('left', newLeft);
        // this.props.updateGeometry();
    }

    render() {
        const style = {
                width     : this.props.horizontalRailWidth + 'px',
                left      : this.props.horizontalRailLeft + 'px',
        };
        if(this.props.isHorizontalBarUsingBottom) {
            style['bottom'] = this.props.horizontalRailBottom + 'px';
        } else {
            style['top'] = this.props.horizontalRailTop + 'px';
        }

        return (
            <div
                className="ps-scrollbar-x-rail"
                style={style}
                onClick={this.handleOnClick}
            >
                <HorizontalBar {...this.props}/>
            </div>
        );
  }
}

export default HorizontalRail;
