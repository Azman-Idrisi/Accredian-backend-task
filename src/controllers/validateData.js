import validator from 'validator';

const validateReferralData = (data) => {
    const { referrerName, referrerEmail, refereeName, refereeEmail, course } = data;
    
    
    if (!referrerName || !referrerEmail || !refereeName || !refereeEmail || !course) {
      return 'All fields are required.';
    }
  
    
    if (!validator.isEmail(referrerEmail)) {
      return 'Invalid referrer email format.';
    }

    
    if (!validator.isEmail(refereeEmail)) {
      return 'Invalid referee email format.';
    }
  
    return null;
  };


  export default validateReferralData;