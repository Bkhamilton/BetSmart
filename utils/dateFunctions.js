export const getDate = (dateString) => {
    const date = new Date(dateString);
    const estDate = new Date(date.getTime());
    const month = estDate.getMonth() + 1; // getMonth returns month index starting from 0
    const day = estDate.getDate();
    return `${month < 10 ? '0' + month : month}/${day < 10 ? '0' + day : day}`; // Returns the date in MM/DD format
};
  
export const getTime = (dateString) => {
    const date = new Date(dateString);
    const estDate = new Date(date.getTime()); // Subtract 4 hours from UTC to get EST
    let hours = estDate.getHours();
    const minutes = estDate.getMinutes();
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const minutesStr = minutes < 10 ? '0' + minutes : minutes;
    return `${hours}:${minutesStr}`; // Returns the time part in 12-hour format
};
  
export const getAmPm = (dateString) => {
    const date = new Date(dateString);
    const estDate = new Date(date.getTime()); // Subtract 4 hours from UTC to get EST
    const hours = estDate.getHours();
    return hours >= 12 ? 'PM' : 'AM';
};