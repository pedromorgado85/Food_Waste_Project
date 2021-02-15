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

module.exports = getCurrentUser;
