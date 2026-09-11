export const registerNotificationHandlers = (io, socket) => {
  // Currently notifications are strictly server -> client pushes.
  // The client joins user:\${userId} in index.js, which notification.service.js uses to emit.
  // We keep this file for future client -> server notification events (e.g. read receipts over socket).
};
