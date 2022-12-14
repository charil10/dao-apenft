export const truncateAddress = (address: string) => {
  if (!address) return "No Account";
  const match = address.match(
    /^(t[a-zA-Z0-9]{4})[a-zA-Z0-9]+([a-zA-Z0-9]{4})$/
  );
  if (!match) return address;
  return `${match[1]}…${match[2]}`;
};

export const toHex = (num: number | string) => {
  const val = Number(num);
  return "0x" + val.toString(16);
};

export const delay = (time = 1000) => {
  return new Promise<void>(function (resolve) {
    setTimeout(() => resolve(), time)
  });
}
