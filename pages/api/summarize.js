import openai from "../../lib/openai";

const handler = async (req, res) => {
  try {
    const { text } = req.body;

    const response = await openai.createCompletion({
      model: "text-davinci-002",
      prompt: `Summarize: ${text}`,
      temperature: 0.7,
      max_tokens: 60,
    });

    res.json({ choices: response.data.choices });
  } catch {
    res.status(500).send("Server Error");
  }
};

export default handler;
