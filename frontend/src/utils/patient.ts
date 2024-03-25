export const getFormattedPatientDob = (dob: string) => {
  return new Date(dob).toLocaleDateString('en-us', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const getPatientAge = (dob: string) => {
  return new Date().getFullYear() - new Date(dob).getFullYear();
};
