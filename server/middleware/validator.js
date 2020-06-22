const isEmail = (email) => {
  const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (email.match(regEx)) return true;
  else return false;
};

const isEmpty = (string) => {
  if (string.trim() === '') return true;
  else return false;
};

const passwordLength = (password) => {
  if(password.length >5 ) return true;
  else return false;
}

const isValidPassword = (password) => {
  const regEx = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
  if (password.match(regEx)) return true;
  else return false;
}

exports.validateSignupData = (data) => {
  let errors = {};

  if (isEmpty(data.email)) {
    errors.email = 'Must not be empty';
  } else if (!isEmail(data.email)) {
    errors.email = 'Must be a valid email address';
  }

  if (isEmpty(data.password)) errors.password = 'Must not be empty';
  if (data.password !== data.confirmPassword)
    errors.confirmPassword = 'Passwords must match';

  if(!passwordLength(data.password)) {
    errors.password = 'Password must be of length greater than 5';
  }
  else if(!isValidPassword(data.password)) {
    errors.password = 'Password must contain one special and numeric character';
  }

  if (isEmpty(data.userName)) errors.handle = 'Must not be empty';

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false
  };
};

exports.validateLoginData = (data) => {
  let errors = {};

  if (isEmpty(data.email)) errors.email = 'Must not be empty';
  if (isEmpty(data.password)) errors.password = 'Must not be empty';

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false
  };
};

exports.validateChangePassword = (data) => {
  let errors = {};
  if(isEmpty(data.oldPassword)) errors.oldPassword = 'Must not be empty';
  if(isEmpty(data.newPassword)) errors.newPassword = 'Must not be empty';
  if(isEmpty(data.confirmPassword)) errors.confirmPassword = 'Must not be empty';
  
  if (data.newPassword !== data.confirmPassword)
    errors.confirmPassword = 'Passwords must match';

  if(!passwordLength(data.newPassword)) {
    errors.newPassword = 'Password must be of length greater than 5';
  }
  else if(!isValidPassword(data.newPassword)) {
    errors.newPassword = 'Password must contain one special and numeric character';
  }

    return {
      errors,
      valid: Object.keys(errors).length === 0 ? true : false
    };
}

exports.reduceUserDetails = (data) => {
  let userDetails = {};

  if (!isEmpty(data.name.trim())) userDetails.name = data.name;
  if (!isEmpty(data.bio.trim())) userDetails.bio = data.bio;
  if (!isEmpty(data.website.trim())) {
    //https://website.com
    if (data.website.trim().substring(0, 4) !== 'http') {
      userDetails.website = `http://${data.website.trim()}`;
    } else userDetails.website = data.website;
  }
  // if (!isEmpty(data.location.trim())) userDetails.location = data.location;

  return userDetails;
};
