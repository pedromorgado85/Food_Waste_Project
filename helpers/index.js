const getCurrentUser = (session) => {
  if (session.currentCompany) {
    return session.currentCompany;
  } else if (session.currentInstitution) {
    return session.currentInstitution;
  } else if (session.currentPerson) {
    return session.currentPerson;
  } else {
    return false;
  }
};

const getCurrentUserType = (session) => {
  if (session.currentCompany) {
    return "company";
  } else if (session.currentInstitution) {
    return "institution";
  } else if (session.currentPerson) {
    return "person";
  } else {
    return false;
  }
};

module.exports = {getCurrentUser,getCurrentUserType }
