export default function getItemName(name) {
  for (let i = name.length; i < 8; i++) {
    name = `0${name}`;
  }
  return name;
}
