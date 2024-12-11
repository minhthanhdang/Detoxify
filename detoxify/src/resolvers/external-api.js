import api from '@forge/api';

const EXTERNAL_API_URL = process.env.EXTERNAL_API_URL;
const MAX_RETRIES = 2;

export async function invokeLambda({ content }) {
  console.log("Content: ", content);
  const URL = EXTERNAL_API_URL + "/ValidateComment";
  console.log(URL);

  let attempt = 0;

  while (attempt < MAX_RETRIES) {
    try {
      // Attempt the API call
      const response = await api.fetch(URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Allow-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          content: content,
        }),
      });

      console.log("Response Headers: ", response.headers);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Lambda Response:", data);
      return data; // Return the successful response data
    } catch (error) {
      attempt++;

      console.error(`Attempt ${attempt} failed: ${error.message}`);

      if (attempt >= MAX_RETRIES) {
        console.error("Max retries reached. Failing.");
        throw new Error(`Failed to invoke Lambda after ${MAX_RETRIES} attempts: ${error.message}`);
      }

      await new Promise((resolve) => setTimeout(resolve, 20000));
    }
  }
}

