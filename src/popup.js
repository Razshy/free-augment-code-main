// Popup window script
document.addEventListener('DOMContentLoaded', function() {
  // Get DOM elements
  const emailDomainInput = document.getElementById('emailDomain');
  const randomLengthInput = document.getElementById('randomLength');
  const saveButton = document.getElementById('saveButton');
  const statusMessage = document.getElementById('statusMessage');
  const link = document.querySelector('a');
  const increaseBtn = document.getElementById('increaseBtn');
  const decreaseBtn = document.getElementById('decreaseBtn');
  const currentValue = document.getElementById('currentValue');

  // Update current value display
  function updateCurrentValue() {
    const value = randomLengthInput.value.trim();
    if (value) {
      currentValue.textContent = value + ' chars';
    } else {
      currentValue.textContent = '12 chars (default)';
    }
  }

  // Load saved settings from storage
  chrome.storage.sync.get(['emailDomain', 'randomLength'], function(result) {
    if (result.emailDomain) {
      emailDomainInput.value = result.emailDomain;
    }

    // Set random string length
    if (result.randomLength) {
      randomLengthInput.value = result.randomLength;
    }

    // Initialize current value display
    updateCurrentValue();
  });

  // Increase button click event
  increaseBtn.addEventListener('click', function() {
    const currentVal = parseInt(randomLengthInput.value) || 0;
    if (currentVal < 32) {
      randomLengthInput.value = currentVal + 1;
      updateCurrentValue();
    }
  });

  // Decrease button click event
  decreaseBtn.addEventListener('click', function() {
    const currentVal = parseInt(randomLengthInput.value) || 2;
    if (currentVal > 1) {
      randomLengthInput.value = currentVal - 1;
      updateCurrentValue();
    }
  });

  // Input field value change event
  randomLengthInput.addEventListener('input', updateCurrentValue);

  // Save button click event
  saveButton.addEventListener('click', function() {
    let domain = emailDomainInput.value.trim();
    let length = randomLengthInput.value.trim();

    // If user entered @, automatically remove it
    if (domain.startsWith('@')) {
      domain = domain.substring(1);
    }

    // Validate if email domain input is empty
    if (!domain) {
      statusMessage.textContent = 'Please enter a valid email domain';
      statusMessage.style.color = '#f44336';
      return;
    }

    // Validate email domain format
    if (domain.includes('@') || !domain.includes('.')) {
      statusMessage.textContent = 'Please enter the correct domain format, such as example.com';
      statusMessage.style.color = '#f44336';
      return;
    }

    // Validate random string length
    if (length && (isNaN(length) || parseInt(length) < 1 || parseInt(length) > 32)) {
      statusMessage.textContent = 'Please enter a valid length between 1-32';
      statusMessage.style.color = '#f44336';
      return;
    }

    // Prepare data to save
    const dataToSave = {
      emailDomain: domain
    };

    // If user set a length, save it
    if (length) {
      dataToSave.randomLength = length;
    }

    // Save to Chrome storage
    chrome.storage.sync.set(dataToSave, function() {
      statusMessage.textContent = 'Settings saved';
      statusMessage.style.color = '#4caf50';

      // Update display
      updateCurrentValue();

      // Clear status message after 3 seconds
      setTimeout(function() {
        statusMessage.textContent = '';
      }, 3000);
    });
  });

  // Add click event to open link in new tab
  if (link) {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      chrome.tabs.create({ url: this.href });
    });
  }
});
