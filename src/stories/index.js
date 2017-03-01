import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import Container from '../components/Container';
import Button from '../index';

storiesOf('Container', module)
  .add('default view', () => (
    <Container width="300px"><div style={{width: '600px', height: '500px'}}>Perfect scrollbar Perfect scrollbar Perfect scrollbar Perfect scrollbar
    Perfect scrollbar Perfect scrollbar Perfect scrollbar Perfect scrollbar Perfect scrollbar Perfect scrollbar Perfect scrollbar
    Perfect scrollbar Perfect scrollbar Perfect scrollbar Perfect scrollbar Perfect scrollbar Perfect scrollbar
    Perfect scrollbar Perfect scrollbar Perfect scrollbar Perfect scrollbar Perfect scrollbar Perfect scrollbar
    Perfect scrollbar Perfect scrollbar Perfect scrollbar Perfect scrollbar Perfect scrollbar Perfect scrollbar
    Perfect scrollbar Perfect scrollbar Perfect scrollbar Perfect scrollbar Perfect scrollbar Perfect scrollbar </div></Container>
  ))
  .add('some emojies as the text', () => (
    <Button>😀 😎 👍 💯</Button>
  ))
  .add('custom styles', () => {
    const style = {
      fontSize: 20,
      textTransform: 'uppercase',
      color: '#FF8833',
    };
    return (
      <Button style={ style }>Hello</Button>
    );
  });
