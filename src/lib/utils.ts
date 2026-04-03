import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(value: number, decimals: number = 2): string {
  return value.toFixed(decimals);
}

export function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

export function toDegrees(radians: number): number {
  return (radians * 180) / Math.PI;
}

export function linspace(start: number, end: number, steps: number): number[] {
  const result: number[] = [];
  const stepSize = (end - start) / (steps - 1);
  for (let i = 0; i < steps; i++) {
    result.push(start + i * stepSize);
  }
  return result;
}
