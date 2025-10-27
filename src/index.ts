#!/usr/bin/env tsx

import chalk from "chalk";
import gradient from "gradient-string";
import boxen from "boxen";
import si from "systeminformation";
import os from "os";
import { getTip } from "./utils/tips.js";
import { Command } from "commander";

const program = new Command();

program
  .option("-l, --live", "Live system monitoring mode with refresh every 2s")
  .parse(process.argv);

const options = program.opts();

function createBar(percentage: number, length = 20): string {
  const filled = Math.round((percentage / 100) * length);
  const empty = length - filled;
  let colorFn = chalk.green;
  if (percentage > 70) colorFn = chalk.yellow;
  if (percentage > 90) colorFn = chalk.red;
  return colorFn("▇".repeat(filled)) + chalk.gray("─".repeat(empty));
}

async function main() {
  console.clear();
  console.log(gradient.pastel.multiline("SysMentor v1.0\n"));

  const [cpu, mem, osInfo] = await Promise.all([
    si.currentLoad(),
    si.mem(),
    si.osInfo(),
  ]);

  const disks = await si.fsSize();

  const cpuLoad = cpu.currentLoad.toFixed(1);
  const memUsage = ((mem.active / mem.total) * 100).toFixed(1);

  const diskUsed = disks.reduce((sum: number, d: any) => sum + d.used, 0);
  const diskTotal = disks.reduce((sum: number, d: any) => sum + d.size, 0);
  const diskUsage = ((diskUsed / diskTotal) * 100).toFixed(1);

  const uptime = Math.floor(os.uptime() / 60);
  const tip = getTip(Number(cpuLoad), Number(memUsage), Number(diskUsage));

  const infoBox = boxen(
    `
OS: ${osInfo.distro} ${osInfo.release}
CPU Usage: ${cpuLoad}% ${createBar(Number(cpuLoad))}
RAM Usage: ${memUsage}% ${createBar(Number(memUsage))}
Disk Usage: ${diskUsage}% ${createBar(Number(diskUsage))}
⏱ Uptime: ${uptime} min

💡 Tip: ${tip}
    `,
    {
      padding: 1,
      margin: 1,
      borderStyle: "round",
      borderColor: "magenta",
      title: " SysMentor Report ",
      titleAlignment: "center",
    }
  );

  console.log(gradient.cristal.multiline(infoBox));
}

async function liveMode() {
  while (true) {
    console.clear();
    console.log(gradient.pastel.multiline("SysMentor Live Mode\n"));

    const [cpu, mem, osInfo] = await Promise.all([
      si.currentLoad(),
      si.mem(),
      si.osInfo(),
    ]);

    const disks = await si.fsSize();

    const cpuLoad = cpu.currentLoad.toFixed(1);
    const memUsage = ((mem.active / mem.total) * 100).toFixed(1);

    const diskUsed = disks.reduce((sum: number, d: any) => sum + d.used, 0);
    const diskTotal = disks.reduce((sum: number, d: any) => sum + d.size, 0);
    const diskUsage = ((diskUsed / diskTotal) * 100).toFixed(1);

    const uptime = Math.floor(os.uptime() / 60);
    const tip = getTip(Number(cpuLoad), Number(memUsage), Number(diskUsage));

    const infoBox = boxen(
      `
OS: ${osInfo.distro} ${osInfo.release}
CPU Usage: ${cpuLoad}% ${createBar(Number(cpuLoad))}
RAM Usage: ${memUsage}% ${createBar(Number(memUsage))}
Disk Usage: ${diskUsage}% ${createBar(Number(diskUsage))}
⏱ Uptime: ${uptime} min

💡 Tip: ${tip}
      `,
      {
        padding: 1,
        margin: 1,
        borderStyle: "round",
        borderColor: "magenta",
        title: " SysMentor Live ",
        titleAlignment: "center",
      }
    );

    console.log(gradient.cristal.multiline(infoBox));

    await new Promise((res) => setTimeout(res, 2000)); // refresh every 2s
  }
}

if (options.live) {
  await liveMode();
} else {
  await main();
}
