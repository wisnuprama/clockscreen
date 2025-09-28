import { AppState } from "react-native";

type TimerCallback = (timestamp: number) => void;

/**
 * GlobalTimer is a singleton class that manages a single timer instance.
 * It allows multiple subscribers to register callbacks that will be invoked
 * every second with the current timestamp. When there are no subscribers,
 * the timer is stopped to conserve resources.
 */
export class GlobalTimer {
  private static instance: GlobalTimer;

  private constructor() {
    this.setup();
  }

  public static getInstance(): GlobalTimer {
    if (!GlobalTimer.instance) {
      GlobalTimer.instance = new GlobalTimer();
    }
    return GlobalTimer.instance;
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
    if(!this.callbacks.size) {
      return;
    }

    if(!this.timer) {
      this.start();
    }

    this.notifyCallbacks();
  }

  private start() {
    if(!this.timer) {
      this.timer = setInterval(() => this.notifyCallbacks(), 1000);
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
