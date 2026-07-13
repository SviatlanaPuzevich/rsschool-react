import React from 'react';
import styles from './main.layout.module.css';

class MainLayout extends React.Component<{ children?: React.ReactNode }> {
  render() {
    return <main className={styles.container}>{this.props.children}</main>;
  }
}

export default MainLayout;
