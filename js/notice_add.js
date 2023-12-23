const notice_title = document.querySelector('#title');
const notice_content = document.querySelector('#content');
const flexCheckDefault = document.querySelector('#flexCheckDefault');

let sessiontoken = localStorage.getItem('sessionToken');
const userId = localStorage.getItem('userId');

const SUCCESS = 201;

async function noticeSubmit() {
  const sendData = {
    title: notice_title.value,
    content: notice_content.value,
    userId: userId,
    onlyMember: flexCheckDefault.checked,
    category: 'notice',
  };

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-pocs-session-token': sessionToken,
    },
    body: JSON.stringify(sendData),
  };

  const response = await fetch('http://34.64.161.55:80/api/posts', options);
  const result = await response.json();

  if (result.status === SUCCESS) {
    window.location.href = '../html/notices.html';
  } else {
    console.log(result.message);
  }
}
