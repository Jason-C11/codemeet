import { spawn } from "child_process";

export function runInDocker(code) {
  return new Promise((resolve) => {
    const docker = spawn(
      "docker",
      [
        "run",
        "--rm",
        "-i",
        "--network",
        "none",
        "--memory",
        "128m",
        "--cpus",
        "0.5",
        "python-runner",
      ],
      {
        stdio: ["pipe", "pipe", "pipe"],
      }
    );

    let stdout = "";
    let stderr = "";

    docker.stdout.on("data", (data) => {
      stdout += data.toString();
    });

    docker.stderr.on("data", (data) => {
      stderr += data.toString();
    });

    docker.on("close", (exitCode) => {
      resolve({
        stdout: stdout.trim(),
        stderr: stderr.trim(),
        exitCode,
      });
    });

    docker.stdin.write(code);
    docker.stdin.end();
  });
}