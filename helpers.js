const emailPattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

function isEmailValid(email){
  return emailPattern.test(email);
}


const helpers = {
  isEmailValid
}


module.exports = helpers
