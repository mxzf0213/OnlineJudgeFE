const sendStatement = async (username, mail, verb, verbId, object, objectId) => {
  const xapiEndpoint = 'http://106.75.216.44/data/xAPI/statements';
  const xapiAuth = 'Basic MzhjYTRhNjEyNDY2Y2MyYzY2NGUyZGQ0NGU4YzQzNjc5ODRiYmRjMjoxYTg2NzY0ODU0ZTM0MGU4YmNhYTM5YmQ3OTY0YTVjMjJmYjFkNGQ1';
  var statement = {
    'actor': {
      'name': username,
      'mbox': 'mailto:' + mail
    },
    'verb': {
      'id': verbId,
      'display': {'en-US': verb}
    },
    'object': {
      'id': objectId,
      'definition': {
        'name': {'en-US': object}
      }
    }
  }
  await fetch(`${xapiEndpoint}`, {
    body: JSON.stringify(statement),
    headers: {
      'authorization': xapiAuth,
      'content-type': 'application/json',
      'x-experience-api-version': '1.0.0',
    },
    method: 'POST',
    mode: 'cors',
  });
  console.log('aa')
};
