const isWithinLastMonth = (dateString) => {
  if (!dateString) return false;

  const today = new Date();
  const startDate = new Date(dateString);
  const diffTime = today - startDate;
  const diffDays = diffTime / (1000 * 60 * 60 * 24);

  return diffDays <= 30;
};
