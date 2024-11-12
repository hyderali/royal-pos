export default function getItemName(name: string): string {
  let paddedName = name;
  for (let i = name.length; i < 8; i++) {
    paddedName = `0${paddedName}`;
  }
  return paddedName;
}