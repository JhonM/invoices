import * as R from "ramda";

const MSGS = {
  SHOW_FORM: "SHOW_FORM",
  CUSTOMER_NAME_INPUT: "CUSTOMER_NAME_INPUT",
  EMAIL_INPUT: "EMAIL_INPUT",
  BILL_TO_INPUT: "BILL_TO_INPUT",
  DESCRIPTION_INPUT: "DESCRIPTION_INPUT",
  DUE_DATE_INPUT: "DUE_DATE_INPUT",
  STATUS_INPUT: "STATUS_INPUT",
  SAVE_INVOICE: "SAVE_INVOICE",
  ADD_INVOICE_LINE: "ADD_INVOICE_LINE",
  LINE_NAME_INPUT: "LINE_NAME_INPUT",
  LINE_HOURS_INPUT: "LINE_HOURS_INPUT",
  LINE_HOURLY_RATE_INPUT: "LINE_HOURLY_RATE_INPUT",
};

/**
 * @param {String} showForm
 * @returns {Object}
 */
export function showFormMsg(showForm) {
  return {
    type: MSGS.SHOW_FORM,
    showForm,
  };
}

/**
 * @param {String} customerName
 * @returns {Object}
 */
export function customerNameMsg(customerName) {
  return {
    type: MSGS.CUSTOMER_NAME_INPUT,
    customerName,
  };
}

/**
 * @param {String} email
 * @returns {Object}
 */
export function emailMsg(email) {
  return {
    type: MSGS.EMAIL_INPUT,
    email,
  };
}

/**
 * @param {String} billTo
 * @returns {Object}
 */
export function billToMsg(billTo) {
  return {
    type: MSGS.BILL_TO_INPUT,
    billTo,
  };
}

/**
 * @param {String} description
 * @returns {Object}
 */
export function descriptionMsg(description) {
  return {
    type: MSGS.DESCRIPTION_INPUT,
    description,
  };
}

/**
 * @param {String} dueDate
 * @returns {Object}
 */
export function dueDateMsg(dueDate) {
  return {
    type: MSGS.DUE_DATE_INPUT,
    dueDate,
  };
}

/**
 * @param {String} status
 * @returns {Object}
 */
export function statusMsg(status) {
  return {
    type: MSGS.STATUS_INPUT,
    status,
  };
}

/**
 * @param {String} lineName
 * @returns {Object}
 */
export function lineNameMsg(lineName) {
  return {
    type: MSGS.LINE_NAME_INPUT,
    lineName,
  };
}

/**
 * @param {Number} lineHours
 * @returns {Object}
 */
export function lineHoursMsg(lineHours) {
  return {
    type: MSGS.LINE_HOURS_INPUT,
    lineHours,
  };
}

/**
 * @param {Number} lineHourlyRate
 * @returns {Object}
 */
export function lineHourlyRateMsg(lineHourlyRate) {
  return {
    type: MSGS.LINE_HOURLY_RATE_INPUT,
    lineHourlyRate,
  };
}

export const saveInvoiceMsg = { type: MSGS.SAVE_INVOICE };

export const addInvoiceLine = { type: MSGS.ADD_INVOICE_LINE };

/**
 * @param {Object} msg
 * @param {Object} model
 * @returns {Object}
 */
function update(msg, model) {
  switch (msg.type) {
    case MSGS.SHOW_FORM: {
      const { showForm } = msg;
      const { nextId } = model;
      return {
        ...model,
        id: nextId,
        showForm,
        customerName: "",
        email: "",
        billTo: "",
        description: "",
        dueDate: "",
        created: new Date(),
        status: "Open",
        lineName: "",
        lineHours: 0,
        lineHourlyRate: 0,
        invoiceLines: [],
      };
    }
    case MSGS.CUSTOMER_NAME_INPUT: {
      const { customerName } = msg;
      return { ...model, customerName };
    }
    case MSGS.EMAIL_INPUT: {
      const { email } = msg;
      return { ...model, email };
    }
    case MSGS.BILL_TO_INPUT: {
      const { billTo } = msg;
      return { ...model, billTo };
    }
    case MSGS.DESCRIPTION_INPUT: {
      const { description } = msg;
      return { ...model, description };
    }
    case MSGS.DUE_DATE_INPUT: {
      const { dueDate } = msg;
      return { ...model, dueDate };
    }
    case MSGS.STATUS_INPUT: {
      const { status } = msg;
      return { ...model, status };
    }
    case MSGS.SAVE_INVOICE: {
      const { editId } = model;
      const updateModel = editId !== null ? edit(model) : add(model);
      return updateModel;
    }
    case MSGS.LINE_NAME_INPUT: {
      const { lineName } = msg;
      return { ...model, lineName };
    }
    case MSGS.LINE_HOURS_INPUT: {
      const { lineHours } = msg;
      return { ...model, lineHours };
    }
    case MSGS.LINE_HOURLY_RATE_INPUT: {
      const { lineHourlyRate } = msg;
      return { ...model, lineHourlyRate };
    }
    case MSGS.ADD_INVOICE_LINE: {
      const { lineName, lineHours, lineHourlyRate } = model;

      const line = {
        lineName,
        lineHours,
        lineHourlyRate,
      };
      const invoiceLines = [...model.invoiceLines, line];

      return {
        ...model,
        invoiceLines,
        lineName: "",
        lineHours: null,
        lineHourlyRate: null,
      };
    }
  }
  return model;
}

/**
 * @param {Object} model
 * @returns {Object}
 */
function edit(model) {
  return model;
}

/**
 * @param {Object} model
 * @returns {Object}
 */
function add(model) {
  const {
    id,
    nextId,
    customerName,
    email,
    billTo,
    description,
    dueDate,
    status,
    invoiceLines,
  } = model;
  const invoice = {
    id,
    customerName,
    email,
    billTo,
    description,
    dueDate,
    status,
    invoiceLines,
  };
  const invoices = [...model.invoices, invoice];

  return {
    ...model,
    invoices,
    nextId: nextId + 1,
    customerName: "",
    email: "",
    billTo: "",
    description: "",
    dueDate: "",
    status: "Open",
    showForm: false,
    lineName: "",
    lineHours: 0,
    lineHourlyRate: 0,
    invoiceLines: [],
  };
}

export default update;
