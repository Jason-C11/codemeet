import ast

from parsers.type_mapper import map_python_type


class PythonParser:
    """
    Parses Python3 starter code and extracts:
    - methodName
    - params
    - returnType

    Only supports single method implementation problems.
    """

    def parse(self, starter_code: str):
        try:
            tree = ast.parse(starter_code)
        except SyntaxError:
            starter_code = self.normalize_code(starter_code)
            tree = ast.parse(starter_code)

        solution_class = next(
            (
                node
                for node in tree.body
                if isinstance(node, ast.ClassDef)
                and node.name == "Solution"
            ),
            None,
        )

        if solution_class is None:
            raise ValueError("Solution class not found.")

        method = next(
            (
                node
                for node in solution_class.body
                if isinstance(node, ast.FunctionDef)
            ),
            None,
        )

        if method is None:
            raise ValueError("Missing implementation method.")

        params = []

        for arg in method.args.args[1:]:
            if arg.annotation is None:
                raise ValueError(
                    f'Parameter "{arg.arg}" has no type annotation.'
                )

            params.append(
                {
                    "name": arg.arg,
                    "type": map_python_type(
                        ast.unparse(arg.annotation)
                    ),
                }
            )

        if method.returns is None:
            raise ValueError("Method has no return type annotation.")

        return {
            "methodName": method.name,
            "params": params,
            "returnType": map_python_type(
                ast.unparse(method.returns)
            ),
        }

    def normalize_code(self, code: str):
        lines = code.splitlines()

        result = []

        for i, line in enumerate(lines):
            result.append(line)

            stripped = line.strip()

            if stripped.startswith("def ") and stripped.endswith(":"):
                indentation = len(line) - len(line.lstrip())

                has_body = False

                for next_line in lines[i + 1:]:
                    if next_line.strip() == "":
                        continue

                    next_indentation = len(next_line) - len(next_line.lstrip())

                    if next_indentation > indentation:
                        has_body = True

                    break

                if not has_body:
                    result.append(" " * (indentation + 4) + "pass")

        return "\n".join(result)