import * as R from "ramda";
import hh from "hyperscript-helpers";
import { h } from "virtual-dom";
import {
  showFormMsg,
  customerNameMsg,
  emailMsg,
  billToMsg,
  descriptionMsg,
  dueDateMsg,
  statusMsg,
  saveInvoiceMsg,
} from "./Update";

const { button, div, form, h1, input, label, option, pre, textarea, select } =
  hh(h);

const STATUS_UNITS = ["Open", "Close", "Due", "Paid"];

/**
 * @param {String} selectedUnit
 * @returns {Array}
 */
function statusUnitOptions(selectedUnit) {
  return R.map(
    (unit) => option({ value: unit, selected: selectedUnit === unit }, unit),
    STATUS_UNITS
  );
}

/**
 * @param {Function} dispatch
 * @returns {Object} - VirtualNode object
 */
function buttonSet(dispatch) {
  return div([
    button(
      { className: "f3 pv2 ph3 bg-blue white bn mr2 dim", type: "submit" },
      "Save"
    ),
    button(
      {
        className: "f3 pv2 ph3 bg-light-grey bn dim",
        type: "button",
        onclick: () => dispatch(showFormMsg(false)),
      },
      "Cancel"
    ),
  ]);
}

/**
 * @param {String} labelText
 * @param {String} value
 * @param {Function} oninput
 * @returns {Object} - VirtualNode object
 */
function fieldset(labelText, value, oninput) {
  return div([
    label({ className: "db mb1" }, labelText),
    input({
      className: "pa2 input-reset ba w-100 mb2",
      type: "text",
      value,
      oninput,
    }),
  ]);
}

/**
 * @param {Function} dispatch
 * @param {Object} model
 * @returns {Object} - VirtualNode object
 */
function formView(dispatch, model) {
  const {
    showForm,
    customerName,
    email,
    billTo,
    description,
    dueDate,
    status,
  } = model;

  if (showForm) {
    return div({ className: "fixed w-100 h-100 absolute--fill bg-gray" }, [
      form(
        {
          className: "mw7 bg-white pv3 ph3 center",
          onsubmit: (e) => {
            e.preventDefault();
            dispatch(saveInvoiceMsg);
            console.log("save form");
          },
        },
        [
          h1("Add invoice"),
          fieldset("Customer name", customerName, (e) =>
            dispatch(customerNameMsg(e.target.value))
          ),
          fieldset("Email", email, (e) => dispatch(emailMsg(e.target.value))),
          fieldset("Bill to", billTo, (e) =>
            dispatch(billToMsg(e.target.value))
          ),
          div([
            label({ className: "db mb1" }, "Description"),
            textarea({
              className: "pa2 input-reset ba w-100",
              value: description,
              oninput: (e) => dispatch(descriptionMsg(e.target.value)),
            }),
          ]),
          div([
            label({ className: "db mb1" }, "Due date"),
            input({
              className: "pa2 input-reset ba w-100 mb2",
              type: "date",
              value: dueDate,
              oninput: (e) => dispatch(dueDateMsg(e.target.value)),
            }),
          ]),
          div([
            label({ className: "db mb1" }, "Status"),
            select(
              {
                className:
                  "db w-100 pa2 ba input-reset br1 bg-white ba b--black",
                onchange: (e) => dispatch(statusMsg(e.target.value)),
              },
              statusUnitOptions(status)
            ),
          ]),
          buttonSet(dispatch),
          pre(JSON.stringify(model, null, 2)),
        ]
      ),
    ]);
  }
}

/**
 * @param {Function} dispatch
 * @param {Object} model
 * @returns {Object} - VirtualNode object
 */
function view(dispatch, model) {
  return div({ className: "relative mw8 center" }, [
    h1({ className: "Some class name" }, "Invoices"),
    button(
      {
        className: "f3 pv2 ph3 bg-blue white bn",
        onclick: () => dispatch(showFormMsg(true)),
      },
      "Add invoice"
    ),
    formView(dispatch, model),
    pre(JSON.stringify(model, null, 2)),
  ]);
}

export default view;
