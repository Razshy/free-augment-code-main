// Check if current URL matches target page
function checkUrl() {
  const targetUrl = 'login.augmentcode.com/u/login/identifier';
  const currentUrl = window.location.href;

  // Check if URL matches target page
  // Since state parameters may change, we only check the basic path
  if (currentUrl.includes(targetUrl)) {
    console.log('Augment Refill: Login page detected');
    // Check if refill button already exists
    if (!document.querySelector('.refill-button-added')) {
      addRefillButton();
    }
  }
}

// Add refill button
function addRefillButton() {
  // Wait for original button to load
  const checkExist = setInterval(() => {
    const originalButton = document.querySelector('button[name="action"][value="default"]');

    if (originalButton && !document.querySelector('.refill-button-added')) {
      clearInterval(checkExist);

      // Create refill button
      const refillButton = document.createElement('button');
      refillButton.type = 'button';
      refillButton.textContent = 'Refill';
      refillButton.className = 'refill-button-added'; // Add special class name for detection

      // Copy original button's style classes
      originalButton.classList.forEach(className => {
        refillButton.classList.add(className);
      });

      // Add click event
      refillButton.addEventListener('click', handleRefill);

      // Insert button after the original button
      originalButton.parentNode.insertBefore(refillButton, originalButton.nextSibling);
      // Set flag indicating button has been added
      buttonAdded = true;
      // Stop observing DOM changes
      observer.disconnect();
      console.log('Augment Refill: Refill button added');
    }
  }, 500);
}

// Handle refill button click
function handleRefill() {
  // Generate random email (now returns Promise)
  generateRandomEmail().then(randomEmail => {
    console.log('Augment Refill: Generated random email', randomEmail);

    // Fill in email input field
    const emailInput = document.querySelector('input[name="username"]');
    if (emailInput) {
      emailInput.value = randomEmail;
      // Trigger input event to ensure form validation recognizes the value change
      const inputEvent = new Event('input', { bubbles: true });
      emailInput.dispatchEvent(inputEvent);

      // Automatically click the original button, delay 1 second to ensure form validation has enough time to process
      setTimeout(() => {
        const originalButton = document.querySelector('button[name="action"][value="default"]');
        if (originalButton) {
          originalButton.click();
          console.log('Augment Refill: Automatically clicked continue button');
        }
      }, 1000);
    }
  }).catch(error => {
    console.error('Augment Refill: Error generating email', error);
  });
}

// Generate random email
function generateRandomEmail() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const charactersLength = characters.length;

  // Get email domain and random string length from storage, use default values if not set
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get(['emailDomain', 'randomLength'], function(data) {
      // Check if email domain is set
      if (!data.emailDomain) {
        // If email domain is not set, prompt the user
        alert('Please set the email domain in the extension settings first!');
        reject(new Error('Email domain not set'));
        return;
      }

      const domain = data.emailDomain;
      // Use the set length, default is 12 characters
      const length = data.randomLength ? parseInt(data.randomLength) : 12;

      // Generate random string
      for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
      }

      resolve(result + '@' + domain);
    });
  });
}

// Create a flag to track if the button has been added
let buttonAdded = false;

// Use debounce function to limit the frequency of checkUrl calls
function debounce(func, wait) {
  let timeout;
  return function() {
    clearTimeout(timeout);
    timeout = setTimeout(func, wait);
  };
}

// Debounced checkUrl function
const debouncedCheckUrl = debounce(checkUrl, 300);

// Check URL when page changes, but use more precise selectors and configuration
const observer = new MutationObserver((mutations) => {
  // Only continue checking if the button has not been added yet
  if (!buttonAdded) {
    debouncedCheckUrl();
  }
});

// Use more precise configuration to observe DOM changes
observer.observe(document.body, {
  childList: true,
  subtree: true,
  attributes: false,
  characterData: false
});

// Initial check
setTimeout(checkUrl, 500);
