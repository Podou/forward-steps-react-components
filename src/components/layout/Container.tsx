import * as React from "react";

// tslint:disable-next-line:no-var-requires
// const styles = require("./styles/index.module.less");
import styles from "./styles/Layout.module.less";

class Container extends React.Component {
  public render() {
    return <div className={styles.container}>{this.props.children}</div>;
  }
}

export default Container;
