import { AppState } from "react-native";

type TimerCallback = (timestamp: number) => void;

/**
 * GlobalTimer is a singleton class that manages a single timer instance.
 * It allows multiple subscribers to register callbacks that will be invoked
 * every second with the current timestamp. When there are no subscribers,
 * the timer is stopped to conserve resources.
 */
class GlobalTimer {
  private intervalMs = 1000;

  constructor(intervalMs: number = 1000) {
    this.intervalMs = intervalMs;
    this.setup();
  }

  private timer: ReturnType<typeof setInterval> | null = null;
  private callbacks: Set<TimerCallback> = new Set();

  private setup() {
    AppState.addEventListener("change", (nextAppState) => {
      if (nextAppState === "active") {
        this.resume();
      } else {
        this.pause();
      }
    });
  }

  private pause() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  private resume() {
    if (!this.callbacks.size) {
      return;
    }

    if (!this.timer) {
      this.start();
    }

    this.notifyCallbacks();
  }

  private start() {
    if (!this.timer) {
      this.timer = setInterval(() => this.notifyCallbacks(), this.intervalMs);
    }
  }

  private notifyCallbacks(): void {
    const timestamp = Date.now();
    this.callbacks.forEach((callback) => callback(timestamp));
  }

  public subscribe(callback: TimerCallback): void {
    if (this.timer) {
      this.callbacks.add(callback);
      return;
    }

    this.callbacks.add(callback);
    this.start();
  }

  public unsubscribe(callback: TimerCallback): void {
    this.callbacks.delete(callback);
    if (this.callbacks.size === 0 && this.timer) {
      this.pause();
    }
  }
}

export const GlobalSecondTimer = new GlobalTimer(1000);
