export function getTip(cpu: number, ram: number, disk: number): string {
  if (cpu > 85) return "[i] Your CPU is working hard! Close heavy tasks or browsers.";
  if (ram > 80) return "[i] RAM is almost full. Consider restarting or freeing memory.";
  if (disk > 90) return "[i] Disk nearly full! Clear unnecessary files.";
  if (cpu < 40 && ram < 50) return "[i] System is chill. Great time to chill!";
  return "[✓] Everything looks balanced. Keep it up";
}
