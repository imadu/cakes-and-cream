
function makeid(n) {
  let text = '';
  let suffix = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < 10; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  switch (n) {
    case 1:
      suffix = '-OP';
      return `${text }${suffix}`;
    case 2:
      suffix = '-SL';
      return `${text }${suffix}`;
    case 3:
      suffix = '-VI';
      return `${text }${suffix}`;
    case 4:
      suffix = '-BG';
      return `${text }${suffix}`;
    default:
      return text;
  }
}
module.exports = makeid;
