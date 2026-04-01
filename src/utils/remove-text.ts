export const removeText = (text: string, remove: string = '') => {
  return text.replace(new RegExp(remove, 'g'), '');
};