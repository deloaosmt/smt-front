const truncate = (text: string, maxLength: number = 30) => {
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
  };

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Б';
  
  const k = 1024;
  const sizes = ['Б', 'КБ', 'МБ', 'ГБ', 'ТБ'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};
  
export { truncate, formatFileSize };
  