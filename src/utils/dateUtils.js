import { format as dateFnsFormat } from 'date-fns';

export const formatDate = (date) => {
  if (!date) return '';
  try {
    const parsedDate = new Date(date);
    return dateFnsFormat(parsedDate, 'MMMM d, yyyy');
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
};