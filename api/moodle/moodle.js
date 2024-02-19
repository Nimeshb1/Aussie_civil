import driverSchema from "../schama/driverSchema.js";
import invoiceSchema from "../schama/invoiceSchema.js";
import jobSchema from "../schama/jobSchema.js";
import userSchama from "../schama/userSchama.js";
import vehicleSchema from "../schama/vehicleSchema.js";

// modle for users
export const postUsers = (obj) => {
  return userSchama(obj).save();
};
export const verifyPost = (filter, obj) => {
  return userSchama.findOneAndUpdate(filter, obj, { new: true });
};
export const getdata = ({ email }) => {
  return userSchama.findOne({ email });
};
export const getUser = (userdata) => {
  return userSchama.findOne(userdata);
};

// dashModel
export const postJobs = (obj) => {
  return jobSchema(obj).save();
};

export const getJobs = (userId) => {
  return jobSchema.find({ user: userId });
};
export const jobsFindandUpdate = (ids, obj) => {
  return jobSchema.findByIdAndUpdate(ids, obj, { new: true });
};
export const findCancle = (ids) => {
  return jobSchema.findOne({ _id: ids });
};
export const deleteJobs = (ids) => {
  return jobSchema.deleteMany({ _id: ids });
};
// vehicle
export const postVehicles = (obj) => {
  return vehicleSchema(obj).save();
};
export const getvechileImage = (userId) => {
  return vehicleSchema.find({ user: userId });
};

// driver
export const postDriver = (obj) => {
  return driverSchema(obj).save();
};
export const getDrivers = (userId) => {
  return driverSchema.find({ user: userId });
};
//
export const postInvoice = (obj) => {
  return invoiceSchema(obj).save();
};
export const getInvoice = (userId) => {
  return invoiceSchema.findById({ _id: userId });
};
