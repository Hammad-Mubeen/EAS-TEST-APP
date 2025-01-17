module.exports = function (req, res, next) {
    var allowedOrigins = [
      "http://localhost:3000",
      "http://localhost:3001"
    ];
    var origin = req.headers.origin;
  
    if (allowedOrigins.indexOf(origin) > -1) {
      // res.setHeader("Access-Control-Allow-Origin", origin);
      res.setHeader("Access-Control-Allow-Origin", origin);
      console.log("host matched");
    }
    else{
      res.setHeader("Access-Control-Allow-Origin", "*");
      console.log("host not matched");
    }
  
    res.setHeader("Cache-Control", "no-cache");
    // res.setHeader("Access-Control-Allow-Origin", process.env.FRONTEND_URL);
    res.setHeader("Access-Control-Allow-Methods", "POST, PUT, GET, DELETE");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Expose-Header", "DAV, content-length, Allow");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, X-Requested-With, Cookies, Set-Cookie"
    );
  
    // console.log("req.method : " + req.method);
  
    // res.setHeader("Access-Control-Request-Headers", "*");
    if(req.method == "OPTIONS")
    {
      return res.status(200).json({});
    }
  
    next();
  };