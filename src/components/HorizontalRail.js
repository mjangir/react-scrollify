import React from 'react';
import HorizontalBar from './HorizontalBar';

class HorizontalRail extends React.Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    
  }

  render() {
    return (
        <div className="ps-scrollbar-x-rail">
            <HorizontalBar/>
        </div>
    );
  }
}

export default HorizontalRail;
