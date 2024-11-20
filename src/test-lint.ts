// This file has intentionally bad formatting and lint issues
const badlyFormattedFunction = async () => {
  const unused = 'this will trigger a lint warning';
  return await Promise.resolve('this is bad practice to await unnecessary promises');
};
