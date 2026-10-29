import os
from pathlib import Path
from dotenv import load_dotenv
import google.genai as genai

def get_available_flash_model():
    env_path = Path(__file__).parent / '.env'
    load_dotenv(dotenv_path=env_path)
    api_key = os.getenv('GEMINI_API_KEY')
    if not api_key:
        raise RuntimeError('GEMINI_API_KEY not set in .env')
    client = genai.Client(api_key=api_key)
    # List models
    models = client.models.list()
    flash_models = [m for m in models if 'flash' in m.name.lower() and getattr(m, 'supports_generate_content', False)]
    if not flash_models:
        raise RuntimeError('No flash models available for this project')
    return flash_models[0].name

if __name__ == '__main__':
    try:
        print(f'AVAILABLE_MODEL={get_available_flash_model()}')
    except Exception as e:
        print(f'ERROR={e}')
