import os
from dotenv import load_dotenv

load_dotenv()

# MongoDB
MONGO_URI = os.getenv("MONGODB_URI")
DATABASE_NAME = os.getenv("MONGODB_NAME")

# Problem source
PROBLEMS_FILE = "./data/problems/merged_problems.json"

# Import settings
MAX_PROBLEMS = 75
 
SUPPORTED_LANGUAGES = [
    "python3",
]

OVERWRITE_EXISTING = True