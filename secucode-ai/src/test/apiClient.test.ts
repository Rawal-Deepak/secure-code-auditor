import axios from "axios";

export async function analyzeCode(code: string): Promise<string> {
  try {
    const response = await axios.post("http://localhost:5000/analyze", {
      code,
    });

    const result = response.data.data; // assuming backend sends { data: <encrypted string> }

    return result; // JSON string or parsed JSON
  } catch (error) {
    throw new Error(`API error: ${error}`);
  }
}
