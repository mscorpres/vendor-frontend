import { imsAxios } from "../axiosInterceptor";

export const getComponentOptions = async (search) => {
  const response = await imsAxios.post("/backend/getComponentByNameAndNo", {
    search,
  });
  return response;
};

export const getComponentDetails = async (componentKey) => {
  const response = await imsAxios.post("/jwvendor/getComponentDetailsByCode", {
    component_code: componentKey,
  });
  return response;
};

export const getComponentClosingStock = async (componentKey, location) => {
  const response = await imsAxios.post("/jwreport/compClosing", {
    component: componentKey,
    location,
  });
  return response;
};

export const postVendorInvoice = async (invoice) => {
  const formData = new FormData();
  formData.append("files", invoice);
  const response = imsAxios.post("/jwvendor/upload-invoice", formData);
  return response;
};

export const postRmConsumption = async (values) => {
  const payload = {
    challan_no: values.documentNumber,
    challan_date: values.documentDate,
    jobwork_attach: values.invoiceNumber,
    component: values.components.map((row) => row.component?.value),
    qty: values.components.map((row) => row.qty),
    pick_location: values.components.map((row) => row.pickLocation),
    remark: values.components.map((row) => row.remark),
  };
  const response = await imsAxios.post("/jwvendor/rmConsp", payload);
  return response;
};
