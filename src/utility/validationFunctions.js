export function validatePhoneNumber(phoneNumber) {
  // Define the regular expression pattern for a valid phone number
  var phonePattern = /^\d{10}$/;

  // Test the phone number against the pattern
  return phonePattern.test(phoneNumber);
}

export function validateEmail(email) {
  // Define the regular expression pattern for a valid phone number
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Test the phone number against the pattern
  return emailRegex.test(email);
}

export function validateName(name) {
  // Trim leading and trailing whitespaces
  const trimmedName = name?.trim();

  // Check if the name is not empty after trimming
  if (!trimmedName) {
    return false;
  }

  // Check if the name contains only letters and spaces
  if (!/^[A-Za-z\s]+$/.test(trimmedName)) {
    return false;
  }

  // If all checks pass, the name is considered valid
  return true;
}
export function validatePAN(panNumber) {
  const regex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  return regex.test(panNumber);
}

export function isValidPassportNumber(passportNumber) {
  // Basic validation for illustrative purposes
  const passportRegex = /^[A-Z0-9]{6,20}$/; // Adjust the regex based on the specific rules

  if (!passportNumber || !passportRegex.test(passportNumber)) {
    return false;
  }

  return true;
}

export function validatePassportExpiry(dateParam) {
  const dateCheck = Date.now();
  // console.log(dateCheck.valueOf < dateParam,"passoportValidation");
  return dateCheck.valueOf < dateParam;
}

export function validateAge(Age) {
  // Convert age to a number if it is a string
  const ageNumber = Number(Age);
  // console.log(Age, "age");

  // Check if the converted age is a valid number and within the range 0 to 120
  return !isNaN(ageNumber) && ageNumber > 0 && ageNumber <= 100;
}
export function validateGender(Gender) {
  return Gender === '1' || Gender === '2';
}

export function validatetitle(Title) {
  const validTitles = ['Mr', 'Mrs', 'Miss'];
  return validTitles.includes(Title);
}

export function validatetitle1(title) {
  const validTitles1 = ['Mr', 'Mrs', 'Miss'];
  return validTitles1.includes(title);
}