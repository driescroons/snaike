import * as React from "react";

export default class Info extends React.Component<{}, { open: boolean }> {
  constructor(props) {
    super(props);
    this.state = {
      open: true
    };
  }

  close = () => {
    this.setState({ open: false });
  };

  open = () => {
    this.setState({ open: true });
  };

  render() {
    return this.state.open ? (
      <div className={"intro"}>
        <div className={"introContent"}>
          <h2>
            <span className={"hi"}>✋</span>Hi, you came to try out Snaike?
          </h2>
          <p>
            Snaike is a browser trained snake neural network that learns to play, you couldn't have guessed it, snake. I hacked something together over the weekend and figured I'd post it online! It's
            made using{" "}
            <a target="_blank" href={"https://www.typescriptlang.org/"}>
              Typescript
            </a>
            ,{" "}
            <a target="_blank" href={"https://www.tensorflow.org"}>
              Tensorflow
            </a>
            ,{" "}
            <a target="_blank" href={"https://www.w3schools.com/html/html5_canvas.asp"}>
              HTML5s Canvas Element
            </a>{" "}
            and{" "}
            <a target="_blank" href={"https://reactjs.org/"}>
              React
            </a>
            .
          </p>

          <p>
            I'd love for you to contribute to the{" "}
            <a target="_blank" href={"https://github.com/driescroons/snaike"}>
              Snaike Repository
            </a>{" "}
            as I'm looking to elaborate on this (and maybe even write a full tutorial for this). Are you looking for a side project and want to help me out? Or would you just like to have a look at
            the code? You'll be able to find a more{" "}
            <a target="_blank" href={"https://github.com/driescroons/snaike"}>
              a elaborate explanation and links to to everyone who made this project possible
            </a>{" "}
            👀
          </p>

          <p>
            You can reach me{" "}
            <a target="_blank" href={"https://twitter.com/croewens"}>
              @CROEWENS
            </a>{" "}
            on twitter, or checkout my website{" "}
            <a target="_blank" href={"https://dries.io"}>
              https://dries.io
            </a>
            .
          </p>
          <p>
            Your computer to slow to actually get results? Checkout the video here!{" "}
            <a target="_blank" href={" https://www.youtube.com/watch?v=kBjSyOzhUYk"}>
              https://www.youtube.com/watch?v=kBjSyOzhUYk
            </a>{" "}
          </p>
        </div>
        <div onClick={() => this.close()} className={"introClose"}>
          ❌
        </div>
      </div>
    ) : (
      <span className={"open"} onClick={() => this.open()}>
        More information? 👀
      </span>
    );
  }
}
