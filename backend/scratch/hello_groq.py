import os
import dotenv
from groq import Groq

dotenv.load_dotenv()
groq_api_key = os.getenv("GROQ_API_KEY")
extraction_model = os.getenv("EXTRACTION_MODEL")
client = Groq(api_key=groq_api_key)

chat_completion = client.chat.completions.create(
    messages=[
        {
            "role": "user",
            "content": "Say hello to Groq!",
        }
    ],
    model=extraction_model,
)

print(chat_completion.choices[0].message.content)