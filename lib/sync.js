export function createSyncChannel(onMessage) {
    const channel = new BroadcastChannel('content-sync');
    channel.onmessage = (event) => onMessage(event.data);
    return channel;
  }
  
  export function broadcastUpdate(channel, data) {
    channel.postMessage(data);
  }