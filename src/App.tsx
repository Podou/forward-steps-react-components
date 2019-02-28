import * as React from "react";
import "./App.css";
import { Container, Header, Footer, Section } from "./components/layout";

class App extends React.Component {
  public render() {
    return (
      <Container>
        <Header>Header</Header>
        <Section title="Section" />
        <Footer>Footer</Footer>
      </Container>
    );
  }
}

export default App;
