import sys
import subprocess
import tempfile

code = sys.stdin.read()

with tempfile.NamedTemporaryFile(suffix=".py", delete=False) as f:
    f.write(code.encode())
    path = f.name

try:
    result = subprocess.run(
        ["python", path],
        capture_output=True,
        text=True,
        timeout=3
    )

    print(result.stdout, end="")
    print(result.stderr, file=sys.stderr, end="")

except subprocess.TimeoutExpired:
    print("TIMEOUT")