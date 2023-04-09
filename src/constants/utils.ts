// creates a debouncable function on a given function using the timeout provided.
function debounce<F extends (...args: any[]) => any>(func: F, timeout = 300) {
    let timer: NodeJS.Timeout;
    return function (this: unknown, ...args: Parameters<F>) {
      clearTimeout(timer);
      timer = setTimeout(() => {
        func.apply(this, args);
      }, timeout);
    } as (...args: Parameters<F>) => ReturnType<F>;
}


export { debounce };