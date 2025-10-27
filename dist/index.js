#!/usr/bin/env ts-node
import chalk from "chalk";
import gradient from "gradient-string";
import boxen from "boxen";
import ora from "ora";
import si from "systeminformation";
import os from "os";
import { getTip } from "./utils/tips.js";
async function main() {
    console.clear();
    console.log(gradient.pastel.multiline("Sysmentor v1.0\n"));
    const spinner = ora("Analyzing your system...").start();
    await new Promise((res) => setTimeout(res, 800));
    const [cpu, mem, osInfo] = await Promise.all([
        si.currentLoad(),
        si.mem(),
        si.osInfo(),
    ]);
    const disks = await si.fsSize();
    spinner.succeed("System analysis complete!\n");
    const cpuLoad = cpu.currentLoad.toFixed(1);
    const totalMem = (mem.total / 1073741824).toFixed(1); // GB
    const usedMem = (mem.active / 1073741824).toFixed(1);
    const memUsage = ((mem.active / mem.total) * 100).toFixed(1);
    const diskUsed = disks.reduce((sum, d) => sum + d.used, 0);
    const diskTotal = disks.reduce((sum, d) => sum + d.size, 0);
    const diskUsage = ((diskUsed / diskTotal) * 100).toFixed(1);
    const uptime = Math.floor(os.uptime() / 60);
    const tip = getTip(Number(cpuLoad), Number(memUsage), Number(diskUsage));
    const infoBox = boxen(`
${chalk.cyan("▄ OS:")} ${osInfo.distro} ${osInfo.release}
${chalk.cyan("▅ CPU Usage:")} ${cpuLoad}%
${chalk.cyan("▆ RAM Usage:")} ${memUsage}% (${usedMem}GB / ${totalMem}GB)
${chalk.cyan("▆ Disk Usage:")} ${diskUsage}%
${chalk.cyan("▇ Uptime:")} ${uptime} minutes

${chalk.yellow("Tip:")} ${tip}
`, {
        padding: 1,
        margin: 1,
        borderStyle: "round",
        borderColor: "magenta",
        title: " SysMentor Report ",
        titleAlignment: "center",
    });
    console.log(gradient.cristal.multiline(infoBox));
}
main().catch((err) => console.error(chalk.red("Error:"), err));
