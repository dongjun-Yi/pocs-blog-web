const notice_title = document.querySelector('#title');
const notice_content = document.querySelector('#content');
const flexCheckDefault = document.querySelector('#flexCheckDefault');

let sessiontoken = localStorage.getItem('sessionToken');
const userId = localStorage.getItem('userId');
const REQUEST_URL = 'http://34.64.161.55:80/api/posts';

const SUCCESS = 201;
const CATEGORY_NOTICE = 'notice';

function isFetchSucess(result) {
  return result.stats === SUCCESS;
}

function goToNoticePage() {
  window.location.href = '../html/notices.html';
}

async function noticeSubmit() {
  const sendData = {
    title: notice_title.value,
    content: notice_content.value,
    userId: userId,
    onlyMember: flexCheckDefault.checked,
    category: CATEGORY_NOTICE,
  };

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-pocs-session-token': sessionToken,
    },
    body: JSON.stringify(sendData),
  };

  const response = await fetch(REQUEST_URL, options);
  const result = await response.json();

  if (isFetchSucess(result)) {
    goToNoticePage();
    return;
  }

  alert(result.message);
}
