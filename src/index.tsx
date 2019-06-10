import * as React from "react";
import * as ReactDOM from "react-dom";
import * as Yup from "yup";

import { Formik, FormikActions, FormikProps, Form, Field, FieldProps } from "formik";
import "./styles/index.scss";
import Manager from "./manager";
import Info from "./components/info";

const div = document.createElement("div");
div.setAttribute("class", "root");
document.body.appendChild(div);

export interface State {
  populationSize: number;
  mutationRate: number;
  timeForSnakeToLive: number;
  moveTowardsScore: number;
  moveAwayFromScore: number;
  eatFoodScore: number;
  gridSize: number;
  displaySize: number;
  lengthOfTick: number;
}

export default class App extends React.Component<{}, State> {
  private snakes = React.createRef<HTMLDivElement>();
  public manager: Manager;

  constructor(props) {
    super(props);
    this.state = {
      populationSize: 100,
      mutationRate: 0.1,
      timeForSnakeToLive: 30,
      moveTowardsScore: 1.5,
      moveAwayFromScore: -0.5,
      eatFoodScore: 30,
      gridSize: 20,
      displaySize: 100,
      lengthOfTick: 1
    };
  }

  static getDerivedStateFromProps = props => {
    return props;
  };

  componentDidMount() {
    this.forceUpdate();
  }

  componentDidUpdate() {
    this.manager = new Manager({ container: this.snakes.current, state: this.state });
  }

  render() {
    return (
      <div className={"app"}>
        <Info />
        <div className={"content"}>
          <div className={"sidebar"}>
            {/* <h2>Sidebar</h2> */}
            <Formik
              initialValues={{
                populationSize: this.state.populationSize,
                mutationRate: this.state.mutationRate,
                timeForSnakeToLive: this.state.timeForSnakeToLive,
                moveTowardsScore: this.state.moveTowardsScore,
                moveAwayFromScore: this.state.moveAwayFromScore,
                eatFoodScore: this.state.eatFoodScore,
                gridSize: this.state.gridSize,
                displaySize: this.state.displaySize,
                lengthOfTick: this.state.lengthOfTick
              }}
              validationSchema={Yup.object().shape({
                populationSize: Yup.number().required("this field is required"),
                mutationRate: Yup.number().required("this field is required"),
                timeForSnakeToLive: Yup.number().required("this field is required"),
                moveTowardsScore: Yup.number().required("this field is required"),
                moveAwayFromScore: Yup.number().required("this field is required"),
                eatFoodScore: Yup.number().required("this field is required"),
                gridSize: Yup.number().required("this field is required"),
                displaySize: Yup.number().required("this field is required"),
                lengthOfTick: Yup.number().required("this field is required")
              })}
              onSubmit={(values: State, actions: FormikActions<State>) => {
                this.setState(values);
                actions.setSubmitting(false);
              }}
              render={(formikBag: FormikProps<State>) => (
                <Form className={"form"}>
                  <div className="formGroup">
                    <button type="submit" disabled={formikBag.isSubmitting} className={"success"}>
                      Start
                    </button>
                  </div>
                  <div className="formGroup">
                    <button type="button" onClick={() => this.manager.stop()} disabled={formikBag.isSubmitting} className={"info"}>
                      Stop
                    </button>
                  </div>
                  {Object.keys(this.state).map(state => (
                    <Field
                      name={state}
                      render={({ field, form }: FieldProps<State>) => (
                        <div className="formGroup">
                          <label htmlFor={field.value}>{state} *</label>
                          <input type="number" {...field} value={field.value} />
                          {/* <ErrorMessage name={field.value} component="div" className="invalid-feedback" /> */}
                          {form.touched[field.name] && form.errors[field.name] && <span>{form.errors[field.name]}</span>}
                        </div>
                      )}
                    />
                  ))}
                </Form>
              )}
            />
          </div>
          <div className={"main"}>
            <div className={"mainWrapper"}>
              {/* <h2>Snakes</h2> */}
              <div className={"snakes"} ref={this.snakes} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<App />, div);
