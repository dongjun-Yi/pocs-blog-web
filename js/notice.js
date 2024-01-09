const tableBodyElement = document.querySelector('#notice table tbody');
const navigationBarElement = document.querySelector('#notice-pagination-bar');

// pagination에 필요한 변수
const OFFSET = 15;
let currentPage = 1;

const MEMBER_TYPE_ANONYMOUS = 'anonymous';

let url = `http://34.64.161.55:80/api/posts?id=notice&offset=${OFFSET}&pageNum=${currentPage}`;
let sessiontoken = localStorage.getItem('sessionToken');
let header = new Headers({ 'x-pocs-session-token': sessiontoken });

function isNoticeDataNull(data) {
  return data.data === null;
}

function isNoticeForMember(data) {
  return data.data.posts[i].onlyMember;
}

function isMemberTypeAnonymous() {
  const userType = localStorage.getItem('userType');
  return userType === MEMBER_TYPE_ANONYMOUS;
}

function renderNoticeListWithNullData() {
  tableBodyElement.innerHTML =
    '<tr><td>0</td><td>글을 작성하세요.</td><td></td></tr>';
  return;
}

function renderNoticeListTableForNonMember(post) {
  tableBodyElement.innerHTML += `
  <tr class="post-list">
  <td>${post.postId}</td>
  <td>비공개</td>
  <td></td>
  <td></td>
  <td></td>
  </tr>
  `;
  return;
}

function renderNoticeListTable(post) {
  tableBodyElement.innerHTML += `
  <tr class="post-list">
  <td>${post.postId}</td>
  <td onclick="window.location.href='notices_detail.html?postId=${post.postId}'"
      style="cursor:pointer">${post.title}</td>
  <td>${post.writerName}</td>
  <td>${post.createdAt}</td>
  <td>${post.category}</td>
  </tr>
  `;
  return;
}

function renderNoticeList(data) {
  const notices = data.posts;

  tableBodyElement.innerHTML = '';

  if (isNoticeDataNull(data)) {
    renderNoticeListWithNullData();
    return;
  }

  if (isNoticeForMember(data) && isMemberTypeAnonymous(data)) {
    notices.forEach((notice) => {
      renderNoticeListTableForNonMember(notice);
    });
    return;
  }

  notices.forEach((notice) => {
    renderNoticeListTable(notice);
  });
}

function renderPreviousPageArrow() {
  return `<ul class="pagination justify-content-center">
  <li class="page-item">
      <a class="page-link" href="#" tabindex="-1" aria-disabled="true" onclick="movePreviousPage()">Previous</a>
  </li>`;
}

function getLastPageNumForNoticeData(totalPageNum) {
  let pageGroup = Math.ceil(currentPage / 5);
  let lastPageNum = pageGroup * 5;
  if (lastPageNum > totalPageNum) {
    // 마지막 그룹이 5개 이하이면
    lastPageNum = totalPageNum;
  }
  return lastPageNum;
}

function getFirstPageNum(lastPageNum) {
  return lastPageNum - 4 <= 0 ? 1 : lastPageNum - 4;
}

function renderPaginationBar(i, totalPageNum) {
  return `<li class="page-item ${
    currentPage == i ? 'active' : ''
  }"><a class="page-link" onclick="movePage(${i}, ${totalPageNum})">${i}</a></li>`;
}

function renderNextPageArrow(totalPageNum) {
  return `<li class="page-item">
  <a class="page-link" href="#" onclick="moveNextPage(${totalPageNum})">Next</a>
</li>`;
}

//pagination 구현
function showPagination(totalPageNum) {
  let paginationBarHTML = renderPreviousPageArrow();
  let lastPageNum = getLastPageNumForNoticeData(totalPageNum);

  let firstPageNum = getFirstPageNum(lastPageNum);
  for (let i = firstPageNum; i <= lastPageNum; i++) {
    paginationBarHTML += renderPaginationBar(i, totalPageNum);
  }

  paginationBarHTML += renderNextPageArrow(totalPageNum);
  navigationBarElement.innerHTML = paginationBarHTML;
}

async function movePage(pageNum, totalPageNum) {
  if (pageNum > totalPageNum) return;
  //이동할 페이지가 이미 그 페이지라면
  if (currentPage === pageNum) return;
  currentPage = pageNum;
  await updatePageAndDisplay();
}

async function moveNextPage(totalPageNum) {
  if (currentPage >= totalPageNum) return;
  currentPage++;
  await updatePageAndDisplay();
}

async function movePreviousPage() {
  //뒤로갈페이지가 1보다 작거나 같을경우 그냥 return
  if (currentPage <= 1) return;
  currentPage--;
  await updatePageAndDisplay();
}

//목록으로 버튼을 누르면 다시 공지사항목록으로 복귀
function backToList() {
  window.location.href = '../html/notices.html';
}

function moveNoticeAddPage() {
  window.location.href = '../html/notices_add.html';
}

function getTotalPageNum(data) {
  const CATEGORIES_COUNT = data.data.categories[1].count;
  return Math.ceil(CATEGORIES_COUNT / OFFSET);
}

async function updatePageAndDisplay() {
  url = `http://34.64.161.55:80/api/posts?id=notice&offset=${OFFSET}&pageNum=${currentPage}`;
  await fetchNotice();
  await showPagination();
}

//공지사항 목록 조회
async function fetchNotice() {
  let response = await fetch(url, { headers: header });
  let data = await response.json();
  let totalPageNum = await getTotalPageNum(data);
  await renderNoticeList(data);
  await showPagination(totalPageNum);
}

fetchNotice();
