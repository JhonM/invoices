// initial model object
const initModel = {
  customerName: "",
  email: "",
  billTo: "",
  description: "",
  dueDate: "",
  created: "",
  status: "",
  showForm: false,
  nextId: 0,
  editId: null,
  invoices: [
    {
      id: 0,
      customerName: "Jane Doe",
      email: "jane@doe.com",
      billTo: "Jane Doe Inc",
      description: "Did some cool stuff",
      dueDate: "2021-12-29",
      status: "Open",
      invoiceLines: [
        {
          lineName: "Setup cool stuff",
          lineHours: 4,
          lineHourlyRate: 25,
          lineAmount: 100,
        },
        {
          lineName: "Some more cool stuff",
          lineHours: 6,
          lineHourlyRate: 25,
          lineAmount: 150,
        },
        {
          lineName: "Some paper work",
          lineHours: 2,
          lineHourlyRate: 25,
          lineAmount: 50,
        },
      ],
      created: "05/10/2021",
      linesAmountTotal: 300,
      linesHoursTotal: 12,
    },
  ],
  lineName: "",
  lineHours: 0,
  lineHourlyRate: 0,
  invoiceLines: [],
  linesAmountTotal: 0,
};

export default initModel;
