import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import ReactScrollify from '../components/Container';
import Button from '../index';

storiesOf('Container', module)
  .add('Default View', () => (
    <ReactScrollify width="300">
        <div style={{width: '600px', height: '500px'}}>React Scrollify React Scrollify React Scrollify React Scrollify
        React Scrollify React Scrollify React Scrollify React Scrollify React Scrollify React Scrollify React Scrollify
        React Scrollify React Scrollify React Scrollify React Scrollify React Scrollify React Scrollify
        React Scrollify React Scrollify React Scrollify React Scrollify React Scrollify React Scrollify
        React Scrollify React Scrollify React Scrollify React Scrollify React Scrollify React Scrollify
        React Scrollify React Scrollify React Scrollify React Scrollify React Scrollify React Scrollify
        React Scrollify React Scrollify React Scrollify React Scrollify React Scrollify React Scrollify React Scrollify
        React Scrollify React Scrollify React Scrollify React Scrollify React Scrollify React Scrollify
        React Scrollify React Scrollify React Scrollify React Scrollify React Scrollify React Scrollify
        React Scrollify React Scrollify React Scrollify React Scrollify React Scrollify React Scrollify
        React Scrollify React Scrollify React Scrollify React Scrollify React Scrollify React Scrollify
        </div>
    </ReactScrollify>
  ));
