  import api from "../services/api";

  export const uploadFile = async (endpoint, fieldName, files, extraId = "") => {
    const formData = new FormData();

    if (Array.isArray(files)) {
      files.forEach((f) => formData.append(fieldName, f));
    } else {
      formData.append(fieldName, files);
    }

    const url = extraId ? `/upload/${endpoint}/${extraId}` : `/upload/${endpoint}`;

    const res = await api.post(url, formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });

    return res.data;
  };