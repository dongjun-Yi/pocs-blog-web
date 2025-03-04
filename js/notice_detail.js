const arr = window.location.href.split('?postId=');
const postId = arr[1];

const notice_title_first = document.querySelector('.notice-title-first');
const notice_title_second = document.querySelector('.notice-title-second');
const notice_detail_content = document.querySelector('.notice-detail-content');

let sessiontoken = localStorage.getItem('sessionToken');
let header = new Headers({ 'x-pocs-session-token': sessiontoken });

const SUCCESS_CODE = 201;
const FORBIDDEN_CODE = 403;
const NOT_FOUNT_CODE = 404;
const SERVER_ERROR_CODE = 500;

function isFetchDataNull(data) {
  return (
    data.status === FORBIDDEN_CODE ||
    data.status === NOT_FOUNT_CODE ||
    data.status === SERVER_ERROR_CODE
  );
}

function renderNoticeDetailPageWithNonData() {
  notice_title_first.innerHTML = '삭제되었거나 없는 게시글입니다.';
  notice_title_second.innerHTML = '';
  posts_buttons.classList.add('hidden');
  return;
}

function renderNoticeDetailPageWithFetchData(data) {
  notice_title_first.innerHTML = `<h3>[<span id="title_category">${data.data.category}</span>]${data.data.title}</h3>`;
  notice_title_second.innerHTML = `
          <div class="me-2">${data.data.onlyMember ? '회원 전용 | ' : ''}</div>
          <div class="me-2">${data.data.updatedAt || data.data.createdAt}</div>
          <div class="me-2"> ${data.data.writer.name} </div>
          <div>조회수 ${data.data.views}</div>
          `;
  notice_detail_content.innerHTML = `<div style="min-height: 200px">${marked.parse(
    data.data.content
  )}</div>`;
  userId = data.data.writer.userId;
  qaWriterId = '';
}

function renderNoticeDetailPage(data) {
  if (isFetchDataNull(data)) {
    renderNoticeDetailPage();
    return;
  }
  renderNoticeDetailPageWithFetchData(data);
}

//공지사항 상세페이지 구현
async function fetchNoticeDetailPage() {
  const d_url = `http://34.64.161.55:80/api/posts/${id}`;

  let response = await fetch(d_url, { headers: header });
  let data = await response.json();
  await renderNoticeDetailPage(data);
}

//공지사항 삭제하기
async function DeleteNotice() {
  const sendData = {
    userId: userId,
  };

  const options = {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'x-pocs-session-token': sessionToken,
    },
    body: JSON.stringify(sendData),
  };

  const response = await fetch(
    `http://34.64.161.55:80/api/posts/${id}/delete`,
    options
  );
  const result = await response.json();

  //삭제 성공(result.status===201)하면
  if (result.status === SUCCESS_CODE) {
    backToList();
  } else {
    console.log(result.message);
  }
}

//목록으로 버튼을 누르면 다시 공지사항목록으로 복귀
function backToList() {
  window.location.href = '../html/notices.html';
}

//공지사항 수정 페이지
function gotoNoticeEditPage() {
  window.location.href = `../html/notices_detail_edit.html?postId=${id}`;
}

fetchNoticeDetailPage();
