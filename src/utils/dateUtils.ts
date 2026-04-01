export const formatDeadlineDate = (days: number): string => {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + days);
    const day = String(targetDate.getDate()).padStart(2, '0');
    const month = String(targetDate.getMonth() + 1).padStart(2, '0');
    const year = String(targetDate.getFullYear()).slice(-2);
    return `${day}/${month}/${year}`;
  };
  
  export const formatDuration = (days: number): string => {
    const weeks = Math.floor(days / 7);
    const remainingDays = days % 7;
    const months = Math.floor(days / 30);
    const remainingWeeks = Math.floor((days % 30) / 7);
    const finalRemainingDays = days % 7;
  
    if (months > 0) {
      let result = `${months} month${months > 1 ? "s" : ""}`;
      if (remainingWeeks > 0)
        result += ` ${remainingWeeks} week${remainingWeeks > 1 ? "s" : ""}`;
      if (finalRemainingDays > 0)
        result += ` ${finalRemainingDays} day${finalRemainingDays > 1 ? "s" : ""}`;
      return result;
    } else if (weeks > 0) {
      let result = `${weeks} week${weeks > 1 ? "s" : ""}`;
      if (remainingDays > 0)
        result += ` ${remainingDays} day${remainingDays > 1 ? "s" : ""}`;
      return result;
    }
    return `${days} day${days > 1 ? "s" : ""}`;
  };

export const formatDate = (dateString: string, locale: string = 'en'): string => {
  const date = new Date(dateString);
  
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  return date.toLocaleDateString(locale, options);
};
  

// 14 Jul (month and day)
export const formatDayMonth = (dateString: string, locale: string = 'en'): string => {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.toLocaleDateString(locale, { month: 'short' });
  return `${day} ${month}`;
};