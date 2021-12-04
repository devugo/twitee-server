export const notFoundErrorMessage = (entity: string, id: string): string => {
  return `${entity} with ID "${id}" not found`;
};

export const successCreationMessage = (entity: string) => {
  return `${entity} has been created successfully`;
};
