

export function getParameterByName(name) {
  name = name.replace(/[[]/, '\\[').replace(/[\]]/, '\\]');
  var regexS = '[\\?&]' + name + '=([^&#]*)';
  var regex = new RegExp(regexS);
  var results = regex.exec(window.location.href);
  if (results == null)
    return '';
  else
    return decodeURIComponent(results[1].replace(/\+/g, ' '));
}

export function convert(val, type) {
  switch (type) {
    case 'string':
      return '' + val;
    case 'number':
      if (isNaN(parseFloat(val))) throw Error('Can not convert ' + val + ' to number');
      if (parseFloat(val) % 1 === 0) return parseInt(val, 10);
      else return parseFloat(val);
    case 'null':
      return null;
    case 'undefined':
      return undefined;
    case 'boolean':
      if (window.parseBool(val) !== undefined) return window.parseBool(val);
      else throw Error('Can not convert ' + val + ' to boolean');
    default:
      throw Error('type ' + type + ' does not exist' + (type === 'bool' ? ' did you mean boolean.' : '.'));
  }
}

export function parseBool(value) {
  return (value || '').toLowerCase() === 'true'
    ? true
    : (value || '').toLowerCase() === 'false'
      ? false
      : undefined;
}

export function encodeIntoQuery(data, discardEmptyOrNull) {
  var ret = [];
  for (var key in data) {
    if (data.hasOwnProperty(key)) {
      if (discardEmptyOrNull && !data[key] && typeof data[key] !== 'number')
        continue;
      ret.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
    }
  }
  return ret ? '?' + ret.join('&') : '';
}

export function camelCaseToSentence(camelCaseNotation) {
  var t = camelCaseNotation.replace(/([A-Z]+)/g, ' $1').replace(/([A-Z][a-z])/g, ' $1');
  return t.charAt(0).toUpperCase() + t.slice(1);
}

export const decodeQuery = (url, discardEmpty) => {
  url = (url || window.location.href).split('?')[1].split('#')[0];
  var ret = {}, qKVP, qParts = url.split('&');
  for (var i = 0; i < qParts.length; i++) {
    qKVP = qParts[i].split('=');
    if (discardEmpty && (!qKVP[0] || !qKVP[1])) continue;
    ret[decodeURIComponent(qKVP[0])] = decodeURIComponent(qKVP[1]);
  }
  return ret;
};

export const urlEncode = (data) => {
  var ret = [];
  for (var key in data) {
    if (data.hasOwnProperty(key)) {
      ret.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
    }
  }
  return ret;
};

export function extendedEncodeURIComponent(str) {
  return encodeURIComponent(str).replace(/[!'()]/g, escape).replace(/\*/g, '%2A');
}

export const autosize = () => {
  var el = this;
  setTimeout(function () {
    el.style.cssText = 'height:auto; padding:0';
    // for box-sizing other than "content-box" use:
    // el.style.cssText = '-moz-box-sizing:content-box';
    el.style.cssText = 'height:' + el.scrollHeight + 'px';
  }, 0);
};


export const toFormData = (obj) => {
  const formData = new FormData();

  for (const key in obj) {
    if (obj.hasOwnProperty(key) && obj[key] !== undefined) {
      formData.append(key, obj[key]);
    }
  }
  return formData;
};

export const deltaTime = (datePast, dateLater = new Date()) => {
  // Make a fuzzy time
  var delta = Math.round((dateLater.getTime() - datePast.getTime()) / 1000);

  var minute = 60,
    hour = minute * 60,
    day = hour * 24,
    week = day * 7;

  let fuzzy;

  if (delta < 30) {
    fuzzy = 'just then';
  } else if (delta < minute) {
    fuzzy = delta + ' seconds ago';
  } else if (delta < 2 * minute) {
    fuzzy = 'a minute ago';
  } else if (delta < hour) {
    fuzzy = Math.floor(delta / minute) + ' minutes ago';
  } else if (Math.floor(delta / hour) === 1) {
    fuzzy = '1 hour ago';
  } else if (delta < day) {
    fuzzy = Math.floor(delta / hour) + ' hours ago';
  } else if (delta < day * 2) {
    fuzzy = 'yesterday';
  } else if (delta < week) {
    fuzzy = 'this week';
  } else if (delta < week * 4) {
    fuzzy = 'this month';
  } else if (delta < week * 52) {
    fuzzy = 'this year';
  } else {
    fuzzy = Math.floor(delta / (week * 52)) + ' years age';
  }
  return fuzzy;
};

export const clamp = (v, min, max) => {
  if (v < min) return min;
  if (v > max) return max;
  return v;
};

export const iterate = (from, to, func) => {
  while(from <= to)
    func(from++);
};

export const strcap = (str, l) => str.length > l ? str.slice(0, l - 3) + '...' : str;

