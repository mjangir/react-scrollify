# React-Scrollify

>React-Scrollify is a react component to make your native scrollbars beautiful.

### Quick Install

```sh
$ npm install react-scrollify
```

### How to use it

#### ES6
```javascript
import ReactScrollify from 'react-scrollify';
```
#### ES5
```javascript
var React = require('react');
var ReactScrollify = require('react-scrollify');
class App extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <ReactScrollify width="300">
                <div style={{width: '600px', height: '500px'}}>Your Content Here</div>
            </ReactScrollify>
        );
    }
}
export default App;
```
That's it.

### Options
```json
{
   "containerClass"     : "",
   "width"              : 200,
   "height"             : 200,
   "wheelSpeed"         : 1,
   "wheelPropagation"   : false,
   "swipePropagation"   : false,
   "minScrollbarLength" : null,
   "maxScrollbarLength" : null,
   "useBothWheelAxes"   : false,
   "suppressScrollX"    : false,
   "suppressScrollY"    : false,
   "scrollXMarginOffset": 0,
   "scrollYMarginOffset": 0,
   "theme"              : "default",
   "onScrollX"          : function(){},
   "onScrollY"          : function(){},
   "onScrollUp"         : function(){},
   "onScrollDown"       : function(){},
   "onScrollLeft"       : function(){},
   "onScrollRight"      : function(){},
   "onScrollXReachStart": function(){},
   "onScrollXReachEnd"  : function(){},
   "onScrollYReachStart": function(){},
   "onScrollYReachEnd"  : function(){}
}
```
