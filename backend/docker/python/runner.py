import sys
import json
import traceback

DEFAULT_IMPORTS = """
import typing
import collections
import functools
import heapq
import itertools
import math
import bisect
import re
import operator
import string

from typing import *
from collections import *
from functools import *
from heapq import *
from itertools import *
from math import *
from bisect import *
from re import *
from operator import *
from string import *
"""

payload = json.loads(sys.stdin.read())

code = payload.get("code", "")
code_to_execute = DEFAULT_IMPORTS + "\n" + code
test_cases = payload.get("testCases", [])
entry = payload["entry"]
mode = payload.get("mode", "exec")

class_name = entry.get("className", "Solution")
method_names = entry["methodNames"]

results = []

try:
    local_vars = {}
    exec(code_to_execute, local_vars)

    SolutionClass = local_vars[class_name]
    sol = SolutionClass()

    method = getattr(sol, method_names[0])
    passed_count = 0
    submissionError = False
    for tc in test_cases:
        try:
            input_args = tc["input"]

            if not isinstance(input_args, list):
                input_args = [input_args]

            result = method(*input_args)

            # Only add evaluation fields in submit mode
            if mode == "submit":
                expected = tc.get("expected")

                if result == expected:
                    passed_count += 1

            else:
                base = {
                    "input": tc["input"],
                    "actual": result
                }
                results.append(base)

        except Exception as e:
            if mode == "exec":
                error_case = {
                    "input": tc.get("input"),
                    "actual": None,
                    "error": str(e)
                }

                results.append(error_case)
            elif mode == "submit":
                submissionError = True
                break
        
    if mode == "submit":
        if submissionError:
            status = "RUNTIME_ERROR"
        elif passed_count == len(test_cases):
            status = "ACCEPTED"
        else:
            status = "WRONG_ANSWER"

        #eventually check for TLE

        print(json.dumps({
            "status": status,
            "mode": "submit",
            "passed": passed_count,
            "total": len(test_cases)
        }))
    else:
        print(json.dumps({
            "status": "OK",
            "mode": "exec",
            "results": results
        }))

except Exception:
    print(json.dumps({
        "status": "RUNTIME_ERROR",
        "error": traceback.format_exc()
    }))