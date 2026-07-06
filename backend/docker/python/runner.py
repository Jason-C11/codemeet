import sys
import json
import traceback

payload = json.loads(sys.stdin.read())

code = payload.get("code", "")
test_cases = payload.get("testCases", [])
entry = payload["entry"]
mode = payload.get("mode", "exec")

class_name = entry.get("className", "Solution")
method_names = entry["methodNames"]

results = []

try:
    local_vars = {}
    exec(code, local_vars)

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