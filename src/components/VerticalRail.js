import React from 'react';
import VerticalBar from './VerticalBar';

class VerticalRail extends React.Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    
  }

  render() {
    return (
        <div className="ps-scrollbar-y-rail">
            <VerticalBar />
        </div>
    );
  }
}

export default VerticalRail;
