import * as React from "react";
import { connect } from "react-redux";
import { Map } from "immutable";
import * as moment from "moment";

class Statistics extends React.Component<{
  generation: number;
  longestSnake: number;
  highscore: number;
  start: number;
}> {
  constructor(props) {
    super(props);
  }

  render() {
    let elapsedTime = "just now";

    const { start } = this.props;
    console.log(start);
    if (Math.abs(moment(start).diff(Date.now())) > 1000) {
      elapsedTime = moment(start).fromNow();
    }

    const shareUrl = new URL("http://twitter.com/share");

    shareUrl.searchParams.append(
      "text",
      `I've ran ${this.props.generation} ${this.props.generation == 1 ? "generation" : "generations"} and the highest scoring snake had a length of ${this.props.longestSnake} and a higshscore of ${
        this.props.highscore
      }. You'd like to checkout AI trained snakes in the browser? Click  👉`
    );

    shareUrl.searchParams.set("url", "https://snaike.dries.io");

    return (
      this.props.generation > 0 && (
        <div className={"statistics"}>
          <div className={"statisticsHeader"}>
            <h2>Statistics</h2>
            <a href={shareUrl.toString()} target="_blank">
              📤
            </a>
          </div>
          <div className={"statisticsList"}>
            <div className={"statistic"}>
              <label>Generation</label>
              <span>{this.props.generation}</span>
            </div>
            <div className={"statistic"}>
              <label>Longest snake</label>
              <span>{this.props.longestSnake}</span>
            </div>
            <div className={"statistic"}>
              <label>Highscore</label>
              <span>{this.props.highscore}</span>
            </div>
            <div className={"statistic"}>
              <label>Started</label>
              <span>{elapsedTime}</span>
            </div>
          </div>
        </div>
      )
    );
  }
}

const mapStateToProps = state => {
  return {
    generation: state.statistics.get("generation"),
    longestSnake: state.statistics.get("longestSnake"),
    highscore: state.statistics.get("highscore"),
    start: state.statistics.get("start")
  };
};

export default connect(mapStateToProps)(Statistics);
