import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const token = process.env.HF_TOKEN;

console.log("HF_TOKEN", process.env.HF_TOKEN);

export const generateImage = async (prompt: string): Promise<string> => {
  try {
    console.log(token);
    const response = await axios.post(
      "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-dev",
      { inputs: prompt },
      {
        headers: {
          Authorization: `Bearer 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`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        responseType: "arraybuffer", // To handle the binary image data
      }
    );

    // Convert the binary data to a base64 string to display as an image
    const base64Image = Buffer.from(response.data, "binary").toString("base64");
    return `data:image/png;base64,${base64Image}`;
  } catch (error) {
    console.error("Error generating image:", error);
    throw new Error("Failed to generate image");
  }
};
