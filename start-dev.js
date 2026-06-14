const { spawn } = require("child_process");
const path = require("path");

const child = spawn("npx.cmd", ["next", "dev"], {
  cwd: path.resolve(__dirname),
  stdio: "ignore",
  detached: true,
  shell: true,
});

child.unref();
console.log("Dev server starting with PID:", child.pid);
process.exit(0);
