import * as React from "react";
import styles from "./styles/Layout.module.less";

export interface ISectionProps {
  title: string;
}

class Section extends React.Component<ISectionProps> {
  public render() {
    const { title } = this.props;
    return (
      <section className={styles.section} id={title}>
        <span>{title}</span>
      </section>
    );
  }
}

export default Section;
