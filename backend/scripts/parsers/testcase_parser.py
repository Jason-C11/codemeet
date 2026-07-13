import ast
import re


def normalize_value(value: str):
    """
    Converts LeetCode formatted values into Python values.
    """

    value = value.strip()

    value = (
        value.replace("true", "True")
        .replace("false", "False")
        .replace("null", "None")
    )

    try:
        return ast.literal_eval(value)
    except Exception:
        return value


def remove_explanation(text: str):
    """
    Removes explanation section from example text.
    """

    if "Explanation:" in text:
        text = text.split("Explanation:")[0]

    return text.strip()


def extract_input_section(text: str):
    """
    Extracts everything between Input: and Output:
    """

    match = re.search(
        r"Input:\s*(.*?)\s*Output:",
        text,
        re.DOTALL,
    )

    if not match:
        raise ValueError(
            f"Could not find Input section:\n{text}"
        )

    return match.group(1).strip()


def extract_output(text: str):
    """
    Extracts Output value.
    """

    match = re.search(
        r"Output:\s*(.*)",
        text,
        re.DOTALL,
    )

    if not match:
        raise ValueError(
            f"Could not find Output section:\n{text}"
        )

    return normalize_value(match.group(1))


def split_parameters(input_text: str):
    """
    Splits parameters while respecting nested lists.

    Example:

    board = [[1,2],[3,4]], k = 2

    becomes:

    [
        ("board", "[[1,2],[3,4]]"),
        ("k", "2")
    ]
    """

    parameters = []

    current = ""
    depth = 0

    parts = []

    for char in input_text:

        if char in "[{(":
            depth += 1

        elif char in "]})":
            depth -= 1

        if char == "," and depth == 0:
            parts.append(current.strip())
            current = ""
        else:
            current += char

    if current.strip():
        parts.append(current.strip())

    for part in parts:

        if "=" not in part:
            continue

        name, value = part.split(
            "=",
            1
        )

        parameters.append(
            (
                name.strip(),
                value.strip()
            )
        )

    return parameters


def extract_inputs(text: str, params):
    """
    Extracts input values and orders them
    according to problem params.

    Example:

    Input:
    nums = [2,7,11,15], target = 9

    Returns:

    [
        [2,7,11,15],
        9
    ]
    """

    input_section = extract_input_section(text)

    extracted = dict(
        split_parameters(input_section)
    )

    ordered_inputs = []

    for param in params:

        name = param["name"]

        if name not in extracted:
            raise ValueError(
                f'Missing parameter "{name}"'
            )

        ordered_inputs.append(
            normalize_value(
                extracted[name]
            )
        )

    return ordered_inputs


def parse_examples(examples, params):
    """
    Converts examples into executable test cases.

    Returns:

    [
        {
            "input": [...],
            "expected": ...
        }
    ]
    """

    test_cases = []

    for example in examples:

        text = remove_explanation(
            example["example_text"]
        )

        inputs = extract_inputs(
            text,
            params
        )

        output = extract_output(text)

        test_cases.append(
            {
                "input": inputs,
                "expected": output,
            }
        )

    return test_cases