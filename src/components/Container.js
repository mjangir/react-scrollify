import React from 'react';
import styles from './css/style.css';
import HorizontalRail from './HorizontalRail';
import VerticalRail from './VerticalRail';

class Container extends React.Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    
  }

  render() {
    return (
        <div style={{width: this.props.width, height: this.props.height, overflow: 'hidden', position: 'relative'}} className="ps-container ps-theme-default ps-active-x ps-active-y">
            <div>
            {this.props.children}
            </div>
            <HorizontalRail />
            <VerticalRail />
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
    onScrollX               : null,
    onScrollY               : null,
    onScrollUp              : null,
    onScrollDown            : null,
    onScrollLeft            : null,
    onScrollRight           : null,
    onScrollXReachStart     : null,
    onScrollXReachEnd       : null,
    onScrollYReachStart     : null,
    onScrollYReachEnd       : null
};

export default Container;