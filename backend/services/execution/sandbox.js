import { runInDocker } from "./dockerRunner.js";

export async function executeCode(code, options = {}) {
  const timeoutMs = options.timeoutMs ?? 3000;

  return new Promise((resolve) => {
    const timer = setTimeout(() => {
      resolve({
        stdout: "",
        stderr: "TIMEOUT",
        exitCode: null,
      });
    }, timeoutMs);

    runInDocker(code).then((result) => {
      clearTimeout(timer);
      resolve(result);
    });
  });
}