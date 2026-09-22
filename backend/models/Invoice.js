const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema(
  {
    invoice_no: { type: String, required: true },
    customer_name: { type: String, required: true },
    invoice_date: { type: String, default: () => new Date().toISOString().slice(0, 10) },
    items: [
      {
        itemId: { type: String, default: '' },
        name: { type: String, default: '' },
        quantity: { type: Number, default: 1 },
        unit_price: { type: Number, default: 0 }
      }
    ],
    total: { type: Number, default: 0 },
    status: { type: String, default: 'Pending', enum: ['Paid', 'Pending', 'Overdue'] },
    gst_rate: { type: Number, default: 18 },
    supplier_name: { type: String, default: '' },
    supplier_address: { type: String, default: '' },
    supplier_phone: { type: String, default: '' }
  },
  { timestamps: true }
);

invoiceSchema.set('toJSON', {
  virtuals: false,
  versionKey: false,
  transform(doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    return ret;
  }
});

module.exports = mongoose.model('Invoice', invoiceSchema);