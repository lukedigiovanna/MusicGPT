// creates a debouncable function on a given function using the timeout provided.
function debounce<T extends Function>(cb: T, wait = 20) {
  let h: any = null;
  let callable = (...args: any) => {
      clearTimeout(h);
      h = setTimeout(() => cb(...args), wait);
  };
  return <T>(<any>callable);
}


export { debounce };