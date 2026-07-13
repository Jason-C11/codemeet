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

    for tc in test_cases:
        try:
            input_args = tc["input"]

            if not isinstance(input_args, list):
                input_args = [input_args]

            result = method(*input_args)

            base = {
                "input": tc["input"],
                "actual": result
            }

            # Only add evaluation fields in submit mode
            if mode == "submit":
                expected = tc.get("expected")
                base["expected"] = expected
                base["passed"] = result == expected

            results.append(base)

        except Exception as e:
            error_case = {
                "input": tc.get("input"),
                "actual": None,
                "error": str(e)
            }

            if mode == "submit":
                error_case["passed"] = False

            results.append(error_case)

    print(json.dumps({
        "status": "OK",
        "mode": mode,
        "results": results
    }))

except Exception:
    print(json.dumps({
        "status": "RUNTIME_ERROR",
        "error": traceback.format_exc()
    }))