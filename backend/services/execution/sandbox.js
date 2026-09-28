import crypto from "crypto";
import { runInDocker } from "./dockerRunner.js";

export async function executeCode(code, metaData) {
  const timeoutMs = metaData.timeoutMs ?? 3000;
  const containerName = `runner-${crypto.randomUUID()}`;

  const payload = {
    ...metaData,
    code,
  };

  return new Promise((resolve) => {
    const { promise, kill } = runInDocker(payload, containerName);
    
    let isSettled = false;

    const timer = setTimeout(() => {
      isSettled = true;
      kill();

      resolve({
        status: "TIMEOUT_ERROR",
        stdout: "",
        stderr: "Execution timed out and container was terminated.",
        exitCode: null,
        result: null,
      });
    }, timeoutMs);

    promise.then((result) => {
      if (isSettled) return; 
      
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
