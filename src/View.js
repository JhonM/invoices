import * as R from "ramda";
import hh from "hyperscript-helpers";
import { h } from "virtual-dom";
import { DateTime } from "luxon";
import {
  showFormMsg,
  showStatusFormMsg,
  customerNameMsg,
  emailMsg,
  billToMsg,
  descriptionMsg,
  dueDateMsg,
  statusMsg,
  saveInvoiceMsg,
  editStatusMsg,
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
  h2,
  h3,
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
  span,
  p,
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

/**
 * @param {String} value
 * @returns {Object} - VirtualNode object
 * @description map value to right color type
 */
function labelOption(dispatch, id, value) {
  const types = {
    Paid: "green",
    Open: "blue",
    Due: "red",
    Close: "gray",
  };
  return span(
    {
      className: `cursor-pointer focus:outline-none text-${types[value]}-600 text-sm py-2.5 px-5 rounded-md border border-${types[value]}-600 hover:bg-${types[value]}-50  flex items-center justify-center inline-block m-2`,
      onclick: () => dispatch(showStatusFormMsg(id, true)),
      title: "Click to edit status",
    },
    value
  );
}

const round = (places) =>
  R.pipe(
    (num) => num * Math.pow(10, places),
    Math.round,
    (num) => num * Math.pow(10, -1 * places)
  );

const formatMoney = R.curry((symbol, places, number) => {
  return R.pipe(
    R.defaultTo(0),
    round(places),
    (num) => num.toFixed(places),
    R.concat(symbol)
  )(number);
});

/**
 * @param {Function} dispatch - VirtualNode
 * @param {Number} id
 * @param {String} status
 * @returns {Object} - VirtualNode object
 */
function statusForm(dispatch, id, status) {
  return div({ className: "w-full" }, [
    select(
      {
        className:
          "h-10 bg-gray-50 flex border border-gray-200 rounded items-center m-2 w-auto",
        onchange: (e) => dispatch(editStatusMsg(id, e.target.value)),
      },
      statusUnitOptions(status)
    ),
  ]);
}

/**
 * @param {Function} dispatch - VirtualNode
 * @param {Object} id
 * @returns {Object} - VirtualNode object
 */
function labelFormView(dispatch, invoice) {
  const { id, status, showStatusForm } = invoice;

  if (showStatusForm) {
    return statusForm(dispatch, id, status);
  }

  return labelOption(dispatch, invoice.id, status);
}

/**
 * @param {String} endDate
 * @returns {Object} - VirtualNode object
 */
function diffDateFromNow(endDate) {
  const start = DateTime.now();
  const end = DateTime.fromISO(endDate);
  return end.diff(start, ["months", "days"]);
}

/**
 * @returns {Object} - VirtualNode object
 */
function tooltipContent() {
  return div({ className: "tooltip-content" }, [
    h3({ className: "mb-3 text-gray-500" }, "UNPAID INVOICE"),
    p({ className: "mb-2" }, "Dear UserName,"),
    p(
      { className: "mb-5" },
      "We\re reaching you to inform about unpaid invoice. Please find it attached."
    ),
    button(
      {
        className:
          "px-4 py-2 rounded-md text-sm font-medium border-0 focus:outline-none focus:ring transition text-white bg-blue-500 hover:bg-blue-600 active:bg-blue-700 focus:ring-blue-300",
      },
      "Send reminder"
    ),
  ]);
}

/**
 * @returns {Object} - VirtualNode object
 */
function tooltip() {
  return div(
    {
      className:
        "relative hover-trigger cursor-pointer border-b-2 border-gray-500 inline-block",
    },
    [
      "Overdue",
      div(
        {
          className: "absolute bg-white p-8 hover-target rounded shadow-lg ",
        },
        [tooltipContent()]
      ),
    ]
  );
}

/**
 * @param {String} dateString
 * @returns {String || Object} - VirtualNode object
 */
function overdueTextView(dateString) {
  const date = diffDateFromNow(dateString);

  if (date.months > 1) {
    return date.toFormat("In M 'months'");
  } else if (date.days > 1) {
    return date.toFormat("In dd 'days'");
  } else if (date.days < 1 && date.days > 0) {
    return date.toFormat("In hh 'minutes'");
  } else if (date.days < 0) {
    return tooltip();
  }
}

/**
 * @param {String} dateString
 * @returns {Object} - VirtualNode object with formatted date
 */
function periodView() {
  const now = DateTime.now();
  const format = now.toFormat("MMMM kkkk");

  return div(format);
}

/**
 * @param {String} dateString
 * @param {String} formatString
 * @returns {Object} - VirtualNode object with formatted date
 */
function dateFormattedView(dateString, formatString) {
  const date = DateTime.fromISO(dateString);
  const format = date.toFormat(formatString);

  return div(format);
}

const toMoney = formatMoney("€", 2);

const invoiceTableHeader = thead({ className: "block md:table-header-group" }, [
  tr([
    cell(
      th,
      "p-2 md:border md:border-grey-500 text-left block md:table-cell",
      "Customer"
    ),
    cell(
      th,
      "p-2 md:border md:border-grey-500 text-left block md:table-cell",
      "#"
    ),
    cell(
      th,
      "p-2 md:border md:border-grey-500 text-left block md:table-cell",
      "Amount"
    ),
    cell(
      th,
      "p-2 md:border md:border-grey-500 text-left block md:table-cell",
      "Period"
    ),
    cell(
      th,
      "p-2 md:border md:border-grey-500 text-left block md:table-cell",
      "Hours"
    ),
    cell(
      th,
      "p-2 md:border md:border-grey-500 text-left block md:table-cell",
      "Due"
    ),
    cell(
      th,
      "p-2 md:border md:border-grey-500 text-left block md:table-cell",
      "Created"
    ),
    cell(
      th,
      "p-2 md:border md:border-grey-500 text-left block md:table-cell",
      "Status"
    ),
  ]),
]);

/**
 * @param {Function} dispatch - VirtualNode
 * @param {String} className
 * @param {Object} invoice
 * @returns {Object} - VirtualNode object
 */
function invoiceRow(dispatch, className, invoice) {
  const dueDateText = overdueTextView(invoice.dueDate);

  return tr({ className }, [
    cell(
      td,
      "p-2 md:border md:border-grey-500 text-left block md:table-cell",
      invoice.customerName
    ),
    cell(
      td,
      "p-2 md:border md:border-grey-500 text-left block md:table-cell",
      invoice.id
    ),
    cell(
      td,
      "p-2 md:border md:border-grey-500 text-left block md:table-cell",
      toMoney(invoice.linesAmountTotal)
    ),
    cell(
      td,
      "p-2 md:border md:border-grey-500 text-left block md:table-cell",
      dateFormattedView(invoice.created, "MMMM kkkk")
    ),
    cell(
      td,
      "p-2 md:border md:border-grey-500 text-left block md:table-cell",
      invoice.linesHoursTotal
    ),
    cell(
      td,
      "p-2 md:border md:border-grey-500 text-left block md:table-cell",
      dueDateText
    ),
    cell(
      td,
      "p-2 md:border md:border-grey-500 text-left block md:table-cell",
      dateFormattedView(invoice.created, "MMM d, kkkk")
    ),
    cell(td, "p-2 md:border md:border-grey-500 text-left block md:table-cell", [
      labelFormView(dispatch, invoice),
    ]),
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
    cell(td, "p-2 text-left block md:table-cell", ""),
    cell(td, "p-2 text-left block md:table-cell", ""),
    cell(
      td,
      "p-2 text-left block md:table-cell bold",
      toMoney(linesAmountTotal)
    ),
  ]);
}

/**
 * @param {Function} dispatch - VirtualNode
 * @param {String} className
 * @param {Array} invoices
 * @returns {Object} - VirtualNode object
 */
function invoicesBody(dispatch, className, invoices) {
  const rows = R.map(
    R.partial(invoiceRow, [
      dispatch,
      "bg-white border border-grey-500 md:border-none block md:table-row",
    ]),
    invoices
  );

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
    return div({ className: "mb-4" }, "No invoices to display....");
  }

  return table({ className: "min-w-full border-collapse block md:table" }, [
    invoiceTableHeader,
    invoicesBody(dispatch, "block md:table-row-group", invoices),
  ]);
}

const invoiceLinesTableHeader = thead(
  { className: "block md:table-header-group" },
  [
    tr(
      {
        className:
          "bg-gray-300 border border-grey-500 md:border-none block md:table-row",
      },
      [
        cell(
          th,
          "p-2 md:border md:border-grey-500 text-left block md:table-cell",
          "Name"
        ),
        cell(
          th,
          "p-2 md:border md:border-grey-500 text-left block md:table-cell",
          "Hours"
        ),
        cell(
          th,
          "p-2 md:border md:border-grey-500 text-left block md:table-cell",
          "Hourly rate"
        ),
        cell(
          th,
          "p-2 md:border md:border-grey-500 text-left block md:table-cell",
          "Amount"
        ),
      ]
    ),
  ]
);

/**
 * @param {Function} dispatch - VirtualNode
 * @param {String} className
 * @param {Object} line
 * @returns {Object} - VirtualNode object
 */
function invoiceLinesRow(dispatch, className, line) {
  return tr({ className }, [
    cell(
      td,
      "p-2 md:border md:border-grey-500 text-left block md:table-cell",
      line.lineName
    ),
    cell(
      td,
      "p-2 md:border md:border-grey-500 text-left block md:table-cell",
      line.lineHours
    ),
    cell(
      td,
      "p-2 md:border md:border-grey-500 text-left block md:table-cell",
      line.lineHourlyRate
    ),
    cell(
      td,
      "p-2 md:border md:border-grey-500 text-left block md:table-cell",
      toMoney(line.lineAmount)
    ),
  ]);
}

/**
 * @param {Array} lines
 * @returns {Object} - VirtualNode object
 */
function invoiceLinesTotalRow(lines) {
  const linesAmountTotal = total(lines, (line) => line.lineAmount);
  const linesHoursTotal = total(lines, (line) => line.lineHours);

  return tr(
    {
      className:
        "bg-gray-300 border border-grey-500 md:border-none block md:table-row",
    },
    [
      cell(
        td,
        "p-2 md:border md:border-grey-500 text-left block md:table-cell",
        "Total"
      ),
      cell(
        td,
        "p-2 md:border md:border-grey-500 text-left block md:table-cell",
        linesHoursTotal
      ),
      cell(
        td,
        "p-2 md:border md:border-grey-500 text-left block md:table-cell",
        ""
      ),
      cell(
        td,
        "p-2 md:border md:border-grey-500 text-left block md:table-cell",
        toMoney(linesAmountTotal)
      ),
    ]
  );
}

/**
 * @param {Function} dispatch - VirtualNode
 * @param {String} className
 * @param {Array} lines
 * @returns {Object} - VirtualNode object
 */
function invoiceLinesBody(dispatch, className, lines) {
  const rows = R.map(
    R.partial(invoiceLinesRow, [
      dispatch,
      "bg-white border border-grey-500 md:border-none block md:table-row",
    ]),
    lines
  );

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
    return div({ className: "mb-5" });
  }

  return table(
    { className: "min-w-full border-collapse block md:table my-10" },
    [invoiceLinesTableHeader, invoiceLinesBody(dispatch, "", lines)]
  );
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
  return div({ className: "flex justify-center" }, [
    button(
      {
        className:
          "px-4 py-2 rounded-md text-sm font-medium border-0 focus:outline-none focus:ring transition text-gray-600 bg-gray-50 hover:text-gray-800 hover:bg-gray-100 active:bg-gray-200 focus:ring-gray-300 mr-3",
        type: "button",
        onclick: () => dispatch(showFormMsg(false)),
      },
      "Cancel"
    ),
    button(
      {
        className:
          "px-4 py-2 rounded-md text-sm font-medium border-0 focus:outline-none focus:ring transition text-white bg-blue-500 hover:bg-blue-600 active:bg-blue-700 focus:ring-blue-300",
        type: "submit",
      },
      "Save"
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
  return div({ className: "mb-5" }, [
    label(labelText),
    input({
      className: "h-10 border mt-1 rounded px-4 w-full bg-gray-50",
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

  return div({ className: "flex justify-between items-center mb-5" }, [
    fieldset("Name", lineName, (e) => dispatch(lineNameMsg(e.target.value))),
    fieldset("Hours", lineHours, (e) => dispatch(lineHoursMsg(e.target.value))),
    fieldset("Hourly rate", lineHourlyRate, (e) =>
      dispatch(lineHourlyRateMsg(e.target.value))
    ),
    button(
      {
        className:
          "px-4 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring transition text-blue-600 hover:bg-blue-50 active:bg-blue-100 focus:ring-blue-300 max-h-12",
        onclick: () => dispatch(addInvoiceLine),
        type: "button",
      },
      "+ Add line"
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
    return div({ className: "fixed w-full h-full inset-0 bg-gray-200" }, [
      form(
        {
          className:
            "relative bg-white rounded shadow-lg p-4 px-4 md:p-8 mb-6 container max-w-screen-lg mx-auto top-24",
          onsubmit: (e) => {
            e.preventDefault();
            dispatch(saveInvoiceMsg);
          },
        },
        [
          h2(
            { className: "font-semibold text-xl text-gray-600 mb-5" },
            "+ Add invoice"
          ),
          fieldset("Customer name", customerName, (e) =>
            dispatch(customerNameMsg(e.target.value))
          ),
          fieldset("Email", email, (e) => dispatch(emailMsg(e.target.value))),
          fieldset("Bill to", billTo, (e) =>
            dispatch(billToMsg(e.target.value))
          ),
          div({ className: "mb-5" }, [
            label("Description"),
            textarea({
              className: "h-10 border mt-1 rounded px-4 w-full bg-gray-50",
              value: description,
              oninput: (e) => dispatch(descriptionMsg(e.target.value)),
            }),
          ]),
          div({ className: "mb-5" }, [
            label("Due date"),
            input({
              className: "h-10 border mt-1 rounded px-4 w-full bg-gray-50",
              type: "date",
              value: dueDate,
              oninput: (e) => dispatch(dueDateMsg(e.target.value)),
            }),
          ]),
          div({ className: "mb-5" }, [
            label("Status"),
            select(
              {
                className:
                  "h-10 bg-gray-50 flex border border-gray-200 rounded items-center mt-1",
                onchange: (e) => dispatch(statusMsg(e.target.value)),
              },
              statusUnitOptions(status)
            ),
          ]),
          invoiceLinesTableView(dispatch, model.invoiceLines),
          div([lineViewForm(dispatch, model)]),
          buttonSet(dispatch),
          // pre(JSON.stringify(model, null, 2)),
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
  return div(
    {
      className: "relative p-6 container max-w-screen-lg mx-auto mt-24",
    },
    [
      div({ className: "flex justify-between mb-8" }, [
        h1(
          { className: "text-gray-600 font-bold md:text-2xl text-xl" },
          "Invoices"
        ),
        button(
          {
            className:
              "px-4 py-2 rounded-md text-sm font-medium border-0 focus:outline-none focus:ring transition text-white bg-blue-500 hover:bg-blue-600 active:bg-blue-700 focus:ring-blue-300",
            onclick: () => dispatch(showFormMsg(true)),
          },
          "+ Add invoice"
        ),
      ]),
      div({ className: "w-full flex justify-end mb-4" }, [
        label(
          {
            className: "border-1 rounded-md flex bg-white p-2 text-sm",
          },
          ["Period: ", periodView()]
        ),
      ]),
      div(
        {
          className:
            "relative bg-white rounded shadow-lg p-4 px-4 md:p-8 mb-6 container max-w-screen-lg mx-auto top-1/4",
        },
        [invoiceTableView(dispatch, model.invoices)]
      ),
      formView(dispatch, model),
      // pre(JSON.stringify(model, null, 2)),
    ]
  );
}

export default view;
