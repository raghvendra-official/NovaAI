import "dotenv/config";

const getGeminiAPIResponse = async (message) => {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": process.env.GEMINI_API_KEY,
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [{ text: message }],
        },
      ],
    }),
  };

  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
      options,
    );
    const data = await response.json();
    //console.log(data.candidates[0].content.parts[0].text);
    //res.send(data.candidates[0].content.parts[0].text); //reply
    if (!response.ok) {
      console.error(data);
      throw new Error(data.error?.message || "Gemini API request failed");
    }

    return data.candidates[0].content.parts[0].text;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export default getGeminiAPIResponse;
