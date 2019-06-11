import * as React from "react";

export default class Help extends React.Component<{}, { open: boolean }> {
  constructor(props) {
    super(props);
    this.state = {
      open: false
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
      <div className={"help"}>
        <div className={"helpContent"}>
          <div className={"helpContentWrapper"}>
            <h2>
              <span className={"clock"}>⏰</span> Give it some time
            </h2>
            <div onClick={() => this.close()} className={"helpClose"}>
              ❌
            </div>
          </div>

          <p>It takes a couple of generations before the snakes start doing anything useful. The following video is from 10 minutes of training.</p>

          <div className={"video"}>
            <video autoPlay={true} playsinline={true} muted={true} loop={true}>
              <source src={"https://giant.gfycat.com/ElementaryFavorableFrogmouth.webm"} type="video/webm" />
            </video>
          </div>
        </div>
      </div>
    ) : (
      <span className={"help helpOpen"} onClick={() => this.open()}>
        It's not working? 🚧
      </span>
    );
  }
}
