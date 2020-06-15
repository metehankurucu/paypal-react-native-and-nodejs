export const urlParseParams = url => {
  var params = {};
  var preTokens = url.split('?');

  if (preTokens.length > 1) {
    var tokens = preTokens[1].split('&');
    for (const token of tokens) {
      var param = token.split('=');
      if (param.length == 2) params[param[0]] = param[1];
    }
  }
  return params;
};
