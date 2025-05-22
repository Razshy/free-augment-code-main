// Background script for managing extension lifecycle
chrome.runtime.onInstalled.addListener(() => {
  console.log('Augment Refill extension installed');
});

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'log') {
    console.log('Message from content script:', message.data);
  }
  return true;
});
