import React from 'react';

interface Props {
  value: string;
  onClick: () => void;
}

class Button extends React.Component<Props> {
  render() {
    return <button onClick={this.props.onClick}>{this.props.value}</button>;
  }
}

export default Button;
