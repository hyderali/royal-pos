export default function todayDate(): string {
  const todayDate = new Date();
  const fullYear = todayDate.getFullYear();
  let fullMonth = (todayDate.getMonth() + 1).toString();
  let fullDate = todayDate.getDate().toString();

  if (Number(fullMonth) < 10) {
    fullMonth = `0${fullMonth}`;
  }
  if (Number(fullDate) < 10) {
    fullDate = `0${fullDate}`;
  }

  return `${fullYear}-${fullMonth}-${fullDate}`;
}