export const getPagination = (page = 1, limit = 10) => {
  const parsedPage = Number(page);
  const parsedLimit = Number(limit);

  const currentPage =
    Number.isInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1;

  const itemsPerPage =
    Number.isInteger(parsedLimit) && parsedLimit > 0 && parsedLimit <= 100
      ? parsedLimit
      : 10;

  const offset = (currentPage - 1) * itemsPerPage;

  return {
    page: currentPage,
    limit: itemsPerPage,
    offset,
  };
};
