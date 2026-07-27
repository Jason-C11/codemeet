import json
from pymongo import MongoClient

from config import (
    MONGO_URI,
    DATABASE_NAME,
    PROBLEMS_FILE,
    MAX_PROBLEMS,
    OVERWRITE_EXISTING,
)
from parsers.python_parser import PythonParser
from parsers.testcase_parser import parse_examples
from validators.problem_validator import ProblemValidator

"""
Imports problem data into MongoDB based on filters from config.py

Source:
github.com/neenza/leetcode-problems/tree/master/problems
"""

client = MongoClient(MONGO_URI)
db = client[DATABASE_NAME]

problems_collection = db["problems"]

python_parser = PythonParser()


def load_problems():
    with open(PROBLEMS_FILE, "r", encoding="utf-8") as file:
        data = json.load(file)

    return data["questions"]

#Transform to expected DB schema
def transform_problem(problem):
    starter_code = problem["code_snippets"].get("python3")

    if not starter_code:
        raise ValueError("Missing python3 starter code")

    python_metadata = python_parser.parse(starter_code)

    sample_test_cases = parse_examples(
        problem.get("examples", []),
        python_metadata["params"]
    )

    return {
        "problemId": problem["problem_slug"],
        "title": problem["title"],
        "difficulty": problem["difficulty"],
        "description": problem["description"],

        "params": python_metadata["params"],
        "returnType": python_metadata["returnType"],

        "examples": [
            {
                "text": example["example_text"],
                "images": example.get("images", [])
            }
            for example in problem.get("examples", [])
        ],

        "constraints": problem.get("constraints", []),

        "methodNames": [
            python_metadata["methodName"]
        ],

        "starterCode": starter_code,

        "sampleTestCases": sample_test_cases,

        "hiddenTestCases": [],
    }

#import to DB
def import_problems():
    problems = load_problems()

    imported = 0
    skipped = 0

    for raw_problem in problems:
        try:
            parsed_problem = transform_problem(raw_problem)

            valid, reason = ProblemValidator.validate(
                parsed_problem
            )

            if not valid:
                print(
                    f"Skipping {raw_problem['title']}: {reason}"
                )
                skipped += 1
                continue

            if OVERWRITE_EXISTING:
                problems_collection.update_one(
                    {
                        "problemId": parsed_problem["problemId"]
                    },
                    {
                        "$set": {
                            "title": parsed_problem["title"],
                            "difficulty": parsed_problem["difficulty"],
                            "description": parsed_problem["description"],
                            "params": parsed_problem["params"],
                            "returnType": parsed_problem["returnType"],
                            "examples": parsed_problem["examples"],
                            "constraints": parsed_problem["constraints"],
                            "methodNames": parsed_problem["methodNames"],
                            "starterCode": parsed_problem["starterCode"],
                            "sampleTestCases": parsed_problem["sampleTestCases"],
                        }
                    },
                    upsert=True,
                )
            else:
                problems_collection.insert_one(parsed_problem)

            imported += 1
            if imported >= MAX_PROBLEMS:
                break

            print(
                f"Imported: {parsed_problem['title']}"
            )

        except Exception as err:
            print(f"FAILED {raw_problem.get('title', 'Unknown')}: {err}")
            skipped += 1

    print("\nImport complete")
    print(f"Imported: {imported}")
    print(f"Skipped: {skipped}")


if __name__ == "__main__":
    import_problems()