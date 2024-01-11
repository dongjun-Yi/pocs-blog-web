const getPostIdURL = window.location.href.split('?postId=');
const postId = getPostIdURL[1];
const REQUEST_URL = `http://34.64.161.55:80/api/posts/${postId}`;
let sessiontoken = localStorage.getItem('sessionToken');
let header = new Headers({ 'x-pocs-session-token': sessiontoken });

let user_Id;
let category;

//공지사항 제목, 공지사항 내용 가져오기
const notice_title = document.querySelector('#title');
const notice_content = document.querySelector('#content');
const flexCheckDefault = document.querySelector('#flexCheckDefault');

const REDIRECT_CODE = 302;

function renderNoticeEditPage(data) {
  notice_title.value = `${data.data.title}`;
  notice_content.value = `${data.data.content}`;
  flexCheckDefault.checked = data.data.onlyMember;
  user_Id = data.data.writer.userId;
  category = data.data.category;
}

async function fetchNoticeEditPageData() {
  const response = await fetch(url, { headers: header });
  const data = await response.await();
  await renderNoticeEditPage(data);
}

function isNoticeEditSucess(result) {
  return result.status === REDIRECT_CODE;
}

//목록으로 버튼을 누르면 다시 공지사항목록으로 복귀
function backToList() {
  window.location.href = '../html/notices.html';
}

//공지사항 수정하기 버튼 눌렀을때 호출되는 함수
async function noticeEdit() {
  const sendData = {
    userId: user_Id,
    title: notice_title.value,
    content: notice_content.value,
    onlyMember: flexCheckDefault.checked,
    category: category,
  };

  const options = {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'x-pocs-session-token': sessionToken,
    },
    body: JSON.stringify(sendData),
  };

  const response = await fetch(REQUEST_URL, options);
  const result = await response.json();
  if (isNoticeEditSucess(result)) {
    backToList();
    return;
  }
  alert(result.message);
}

fetchNoticeEditPageData();
