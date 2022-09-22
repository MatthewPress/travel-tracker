import { requestData } from './scripts';

function getData(path) {
  return fetch(`http://localhost:3001/api/v1/${path}`)
    .then(response => {
      if (!response.ok) {
        throw new Error();
      }
      return response.json();
    })
    .catch(error => {
      alert('get error');
    });
}

function postData(path, request) {
  const entry = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request)
  };

  return fetch(`http://localhost:3001/api/v1/${path}`, entry)
    .then(response => {
      if (!response.ok) {
        throw new Error();
      }
      return response.json();
    })
    .then(() => {
      requestData(50);
    })
    .catch(error => {
      alert('post error');
    });
}

export { getData, postData };