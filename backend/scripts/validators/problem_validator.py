from typing import Tuple
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
}

class ProblemValidator:
    """
    Validates whether a parsed problem can be imported 
    """
    
    @staticmethod
    def validate(problem: dict) -> Tuple[bool, str]:
        # Required top-level fields
        required_fields = [
            "problemId",
            "title",
            "difficulty",
            "description",
            "params",
            "returnType",
            "methodNames",
            "starterCode",
            "sampleTestCases",
        ]
        
        for field in required_fields:
            if field not in problem:
                return False, f'Missing required field "{field}".'
        
        #Must have exactly one method
        if not problem["methodNames"]:
            return False, "Missing method name."
        
        # Should have at least a single sample test case
        if len(problem["sampleTestCases"]) == 0:
            return False, "Missing sample test cases."
    
        # Every parameter needs a name and type
        for param in problem["params"]:
            if "name" not in param or "type" not in param:
                return False, "Invalid parameter."
        
        # Only support single method problems
        if len(problem["methodNames"]) != 1:
            return False, "Only single method problems are supported."

        # Only support single return types 
        if problem["returnType"] not in SUPPORTED_TYPES:
            return (
                False,
                f'Unsupported return type: {problem["returnType"]}',
            )

        return True, "OK"

    

