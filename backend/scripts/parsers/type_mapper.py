# Maps python types to expected types used in backend

#current supported types 
SUPPORTED_TYPES = {
    "int",
    "float",
    "string",
    "boolean",
    "int[]",
    "float[]",
    "string[]",
    "boolean[]",
    "int[][]",
    "float[][]",
    "string[][]",
    "boolean[][]",
    "void",
}


PYTHON_TYPE_MAP = {
    "int": "int",
    "float": "float",
    "str": "string",
    "bool": "boolean",
    "None": "void",
    "NoneType": "void",
}


def map_python_type(python_type: str) -> str:
    """
    Converts Python type annotations into application DBTypes.

    Examples:
        int -> int
        List[int] -> int[]
        List[List[str]] -> string[][]
    """

    python_type = python_type.strip()

    # Direct primitive mappings
    if python_type in PYTHON_TYPE_MAP:
        return PYTHON_TYPE_MAP[python_type]

    # Handle list types
    if python_type.startswith("List[") and python_type.endswith("]"):
        inner_type = python_type[5:-1].strip()

        mapped_inner = map_python_type(inner_type)

        if mapped_inner not in SUPPORTED_TYPES:
            raise ValueError(f"Unsupported list type: {python_type}")

        return f"{mapped_inner}[]"

    raise ValueError(f"Unsupported Python type: {python_type}")