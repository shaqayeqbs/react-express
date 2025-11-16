import axiosInstance from "./axiosInstance";

export const uploadImage = async (imageFile) => {
  try {
    const formData = new FormData();
    formData.append("image", imageFile);

    const response = await axiosInstance.post("/upload/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data.url;
  } catch (error) {
    console.error("Image upload failed:", error);
    throw new Error(error.response?.data?.message || "Failed to upload image");
  }
};
