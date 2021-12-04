export const validationErrorMessage = (errors: any[]): string => {
  let message = '';
  const [error] = errors;

  if (error) {
    message = `${error.msg} for ${error.param}`;
  }
  return message;
};
