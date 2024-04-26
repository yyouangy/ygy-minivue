export const extend = Object.assign;

export function isObject(val) {
  return val !== null && typeof val === "object";
}

export function hasChanged(value, newValue) {
  return !Object.is(value, newValue);
}

const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};
export const toHanderKey = (str: string) => {
  return str ? "on" + capitalize(str) : "";
};

export const camelize = (str: string) => {
  return str.replace(/-(\w)/g, (_, c: string) => {
    return c ? c.toUpperCase() : "";
  });
};
