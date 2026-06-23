export default function raw(pattern: RegExp) {
  return {
    name: `raw:${pattern.source}`,
    transform(code: string, id: string) {
      if (!pattern.test(id)) {
        return;
      }

      return {
        code: `export default ${JSON.stringify(code)}`,
        map: null,
      };
    },
  };
}
