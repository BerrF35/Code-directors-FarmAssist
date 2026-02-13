import * as functions from "firebase-functions";

export const hfProxy = functions.https.onRequest(async (req, res) => {
  const token = functions.config().hf.token;

  if (!token) {
    res.status(500).send("Missing HuggingFace token");
    return;
  }

  try {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: req.body.prompt,
          parameters: {
            max_new_tokens: 200,
            temperature: 0.7,
          },
        }),
      }
    );

    const data = await response.json();

    res.set("Access-Control-Allow-Origin", "*");
    res.send(data);
  } catch (err) {
    res.status(500).send("HuggingFace request failed");
  }
});
