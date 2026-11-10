import "dotenv/config";
import { OpenRouter } from "@openrouter/sdk";



// Create OpenRouter client
const openrouter = new OpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY
});


const getOpenRouterResponse =  async (message) => {
  try {
    
    if (!message) {
      return res.status(400).json({
        error: "Message is required"
      });
    }

    const response = await openrouter.chat.send({
      chatRequest: {
        model: "openrouter/free",
        messages: [
          {
            role: "user",
            content: message
          }
        ]
      }
    });

    return response.choices[0]?.message?.content;

  } catch (error) {
    console.error("OpenRouter Error:", error);

    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
export default getOpenRouterResponse;
