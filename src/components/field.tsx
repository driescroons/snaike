import * as React from "react";
import { Formik } from "formik";

export default class FormField extends React.Component<
  {
    label: string;
    description: string;
    value: number;
    form: any;
    field: any;
  },
  { open: boolean }
> {
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
    const { field, form, label, description, value } = this.props;
    return (
      <div className="formGroup">
        <div className="formGroupHeader">
          <label htmlFor={field.value}>{label} *</label>
          {this.state.open ? (
            <span className="formGroupOpen" onClick={this.close}>
              ❌
            </span>
          ) : (
            <span className="formGroupOpen" onClick={this.open}>
              ℹ️
            </span>
          )}
        </div>
        <input type="number" {...field} value={value} />
        {this.state.open && <span className="formGroupDescription">{description}</span>}
        {form.touched[field.name] && form.errors[field.name] && <span className="formGroupError">{form.errors[field.name]}</span>}
      </div>
    );
  }
}
