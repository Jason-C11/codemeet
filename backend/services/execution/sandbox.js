import { runInDocker } from "./dockerRunner.js";

export async function executeCode(code, metaData) {
  const timeoutMs = metaData.timeoutMs ?? 3000;

  const payload = {
    ...metaData,
    code,
  };

  return new Promise((resolve) => {
    const timer = setTimeout(() => {
      resolve({
        status: "TIMEOUT",
        stdout: "",
        stderr: "TIMEOUT",
        exitCode: null,
        result: null,
      });
    }, timeoutMs);

    runInDocker(payload).then((result) => {
      clearTimeout(timer);

      let parsed = null;

      try {
        parsed = JSON.parse(result.stdout);
      } catch (e) {
        return resolve({
          status: "ERROR",
          stdout: result.stdout,
          stderr: result.stderr || "Failed to parse runner output",
          exitCode: result.exitCode,
          result: null,
        });
      }

      resolve({
        status: parsed?.status ?? "OK",
        result: parsed, 
        stderr: result.stderr,
        exitCode: result.exitCode,
      });
    });
  });
}