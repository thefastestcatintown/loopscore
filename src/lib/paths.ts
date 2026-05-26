const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

export const withBase = (path: string) => {
  if (!path || /^(https?:|mailto:|tel:|#)/.test(path)) {
    return path;
  }

  return `${basePath}${path.startsWith("/") ? path : `/${path}`}`;
};
