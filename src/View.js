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
  addInvoiceLine,
  lineNameMsg,
  lineHoursMsg,
  lineHourlyRateMsg,
} from "./Update";
import { total } from "./helpers";

const {
  button,
  div,
  form,
  h1,
  input,
  label,
  option,
  pre,
  table,
  tbody,
  textarea,
  thead,
  tr,
  th,
  td,
  select,
} = hh(h);

const STATUS_UNITS = ["Open", "Close", "Due", "Paid"];

/**
 * @param {Object} tag - VirtualNode
 * @param {String} className
 * @param {String} value
 * @returns {Object} - VirtualNode object
 */
function cell(tag, className, value) {
  return tag({ className }, value);
}

const invoiceTableHeader = thead([
  tr([
    cell(th, "pa2 tl", "Customer"),
    cell(th, "pa2 tl", "#"),
    cell(th, "pa2 tl", "Amount"),
    cell(th, "pa2 tl", "Period"),
    cell(th, "pa2 tl", "Hours"),
    cell(th, "pa2 tl", "Due"),
    cell(th, "pa2 tl", "Created"),
    cell(th, "pa2 tl", "Status"),
  ]),
]);

/**
 * @param {Function} dispatch - VirtualNode
 * @param {String} className
 * @param {Object} invoice
 * @returns {Object} - VirtualNode object
 */
function invoiceRow(dispatch, className, invoice) {
  return tr({ className }, [
    cell(td, "pa2", invoice.customerName),
    cell(td, "pa2 tl", invoice.id),
    cell(td, "pa2 tl", invoice.linesAmountTotal),
    cell(td, "pa2 tl", "Period"),
    cell(td, "pa2 tl", invoice.linesHoursTotal),
    cell(td, "pa2 tl", invoice.dueDate),
    cell(td, "pa2 tl", invoice.created),
    cell(td, "pa2 tl", invoice.status),
  ]);
}

/**
 * @param {Array} invoices
 * @returns {Object} - VirtualNode object
 */
function invoiceTotalRow(invoices) {
  const linesAmountTotal = total(
    invoices,
    (invoice) => invoice.linesAmountTotal
  );

  return tr({ className: "bt b" }, [
    cell(td, "", ""),
    cell(td, "", ""),
    cell(td, "pa2 tl", linesAmountTotal),
  ]);
}

/**
 * @param {Function} dispatch - VirtualNode
 * @param {String} className
 * @param {Array} invoices
 * @returns {Object} - VirtualNode object
 */
function invoicesBody(dispatch, className, invoices) {
  const rows = R.map(R.partial(invoiceRow, [dispatch, ""]), invoices);

  const rowsWithTotal = [...rows, invoiceTotalRow(invoices)];

  return tbody({ className }, rowsWithTotal);
}

/**
 * @param {Function} dispatch - VirtualNode
 * @param {Array} invoices
 * @returns {Object} - VirtualNode object
 */
function invoiceTableView(dispatch, invoices) {
  if (invoices.length === 0) {
    return div({ className: "mv2 i black-50" }, "No invoices to display....");
  }

  return table({ className: "mv2 w-100 collapse" }, [
    invoiceTableHeader,
    invoicesBody(dispatch, "", invoices),
  ]);
}

const invoiceLinesTableHeader = thead([
  tr([
    cell(th, "pa2 tl", "Name"),
    cell(th, "pa2 tl", "Hours"),
    cell(th, "pa2 tl", "Hourly rate"),
    cell(th, "pa2 tl", "Amount"),
  ]),
]);

/**
 * @param {Function} dispatch - VirtualNode
 * @param {String} className
 * @param {Object} line
 * @returns {Object} - VirtualNode object
 */
function invoiceLinesRow(dispatch, className, line) {
  return tr({ className }, [
    cell(td, "pa2", line.lineName),
    cell(td, "pa2 tl", line.lineHours),
    cell(td, "pa2 tl", line.lineHourlyRate),
    cell(td, "pa2 tl", line.lineAmount),
  ]);
}

/**
 * @param {Array} lines
 * @returns {Object} - VirtualNode object
 */
function invoiceLinesTotalRow(lines) {
  const linesAmountTotal = total(lines, (line) => line.lineAmount);
  const linesHoursTotal = total(lines, (line) => line.lineHours);

  return tr({ className: "bt b" }, [
    cell(td, "pa2 tl", "Total"),
    cell(td, "pa2 tl", linesHoursTotal),
    cell(td, "", ""),
    cell(td, "pa2 tl", linesAmountTotal),
  ]);
}

/**
 * @param {Function} dispatch - VirtualNode
 * @param {String} className
 * @param {Array} lines
 * @returns {Object} - VirtualNode object
 */
function invoiceLinesBody(dispatch, className, lines) {
  const rows = R.map(R.partial(invoiceLinesRow, [dispatch, ""]), lines);

  const rowsWithTotal = [...rows, invoiceLinesTotalRow(lines)];

  return tbody({ className }, rowsWithTotal);
}

/**
 * @param {Function} dispatch - VirtualNode
 * @param {Array} lines
 * @returns {Object} - VirtualNode object
 */
function invoiceLinesTableView(dispatch, lines) {
  if (lines.length === 0) {
    return div({ className: "mv2 i black-50" }, "No invoices to display....");
  }

  return table({ className: "mv2 w-100 collapse" }, [
    invoiceLinesTableHeader,
    invoiceLinesBody(dispatch, "", lines),
  ]);
}

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
function lineViewForm(dispatch, model) {
  const { lineName, lineHours, lineHourlyRate } = model;

  return div({ className: "flex justify-between" }, [
    fieldset("Name", lineName, (e) => dispatch(lineNameMsg(e.target.value))),
    fieldset("Hours", lineHours, (e) => dispatch(lineHoursMsg(e.target.value))),
    fieldset("Hourly rate", lineHourlyRate, (e) =>
      dispatch(lineHourlyRateMsg(e.target.value))
    ),
    button(
      {
        className: "f3 pv2 ph3 bg-blue white bn",
        onclick: () => dispatch(addInvoiceLine),
        type: "button",
      },
      "Add line"
    ),
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
          invoiceLinesTableView(dispatch, model.invoiceLines),
          div([lineViewForm(dispatch, model)]),
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
    div({ className: "flex justify-between" }, [
      h1({ className: "Some class name" }, "Invoices"),
      button(
        {
          className: "f3 pv2 ph3 bg-blue white bn",
          onclick: () => dispatch(showFormMsg(true)),
        },
        "Add invoice"
      ),
    ]),
    invoiceTableView(dispatch, model.invoices),
    formView(dispatch, model),
    pre(JSON.stringify(model, null, 2)),
  ]);
}

export default view;
