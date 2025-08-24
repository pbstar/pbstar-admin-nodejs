export default (req, res, next) => {
  !req.query && (req.query = {});
  !req.body && (req.body = {});
  !req.params && (req.params = {});
  next();
};
