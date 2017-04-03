export default function todayDate() {
  let todayDate = new Date();
  let fullYear = todayDate.getFullYear();
  let fullMonth = todayDate.getMonth() + 1;
  if (fullMonth < 10) {
    fullMonth = `0${fullMonth}`;
  }
  let fullDate = todayDate.getDate();
  if (fullDate < 10) {
    fullDate = `0${fullDate}`;
  }
  let date = `${fullYear}-${fullMonth}-${fullDate}`;
  return date;
}
