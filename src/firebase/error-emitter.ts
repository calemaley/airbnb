import { EventEmitter } from "events";

// This is a simple event emitter to globally handle Firebase permission errors.
// In a larger application, you might use a more robust state management solution.
export const errorEmitter = new EventEmitter();
