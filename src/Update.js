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

export const saveInvoiceMsg = { type: MSGS.SAVE_INVOICE };

/**
 * @param {Object} msg
 * @param {Object} model
 * @returns {Object}
 */
function update(msg, model) {
  switch (msg.type) {
    case MSGS.SHOW_FORM: {
      const { showForm } = msg;
      return {
        ...model,
        showForm,
        customerName: "",
        email: "",
        billTo: "",
        description: "",
        dueDate: "",
        created: new Date(),
        status: "Open",
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
  debugger;
  const { nextId, customerName, email, billTo, description, dueDate, status } =
    model;
  const invoice = {
    id: nextId,
    customerName,
    email,
    billTo,
    description,
    dueDate,
    status,
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
  };
}

export default update;
