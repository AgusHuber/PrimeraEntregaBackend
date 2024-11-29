export const processError = (res, error) => {
    res.setHeader("Content-Type", "application/json");
    return res.status(500).json({
      error: `Error.`,
      detail: `${error.message}`,
    });
  };