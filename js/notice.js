const notice = document.querySelector('#notice table');
const thead = document.querySelector('#notice table thead');
const tbody = document.querySelector('#notice table tbody');

// pagination에 필요한 변수
const OFFSET = 15;
let currentPage = 1;
let totalPage;

const userType = localStorage.getItem('userType');
const MEMBER_TYPE_ANONYMOUS = 'anonymous';

let url = `http://34.64.161.55:80/api/posts?id=notice&offset=${OFFSET}&pageNum=${currentPage}`;
let sessiontoken = localStorage.getItem('sessionToken');
let header = new Headers({ 'x-pocs-session-token': sessiontoken });

function renderNoticePage(data) {
  const PAGE_LENGTH = data.data.posts.length;
  const CATEGORIES_COUNT = data.data.categories[1].count;

  tbody.innerHTML = '';
  if (data.data === null) {
    tbody.innerHTML = '<tr><td>0</td><td>글을 작성하세요.</td><td></td></tr>';
  } else {
    totalPage = Math.ceil(CATEGORIES_COUNT / OFFSET);
    for (let i = 0; i < PAGE_LENGTH; i++) {
      if (data.data.posts[i].onlyMember && userType === MEMBER_TYPE_ANONYMOUS) {
        tbody.innerHTML += `
              <tr class="post-list">
              <td>${data.data.posts[i].postId}</td>
              <td>비공개</td>
              <td></td>
              <td></td>
              <td></td>
              </tr>
              `;
      } else {
        tbody.innerHTML += `
              <tr class="post-list">
              <td>${data.data.posts[i].postId}</td>
              <td onclick="window.location.href='notices_detail.html?postId=${data.data.posts[i].postId}'"
                  style="cursor:pointer">${data.data.posts[i].title}</td>
              <td>${data.data.posts[i].writerName}</td>
              <td>${data.data.posts[i].createdAt}</td>
              <td>${data.data.posts[i].category}</td>
              </tr>
              `;
      }
    }
  }
}

//공지사항 목록 조회
async function fetchNotice() {
  let response = await fetch(url, { headers: header });
  let data = await response.json();
  await renderNoticePage(data);
  await showPagination();
}

//pagination 구현
function showPagination() {
  let pageHTML = `<ul class="pagination justify-content-center">
                <li class="page-item">
                    <a class="page-link" href="#" tabindex="-1" aria-disabled="true" onclick="movePreviousPage()">Previous</a>
                </li>`;
  let pageGroup = Math.ceil(currentPage / 5);
  let last = pageGroup * 5;
  if (last > totalPage) {
    // 마지막 그룹이 5개 이하이면
    last = totalPage;
  }

  let first_num = last - 4 <= 0 ? 1 : last - 4;
  for (let i = first_num; i <= last; i++) {
    pageHTML += `<li class="page-item ${
      currentPage == i ? 'active' : ''
    }"><a class="page-link" onclick="movePage(${i})">${i}</a></li>`;
  }

  pageHTML += `<li class="page-item">
                    <a class="page-link" href="#" onclick="moveNextPage()">Next</a>
                </li>`;

  document.querySelector('#notice-pagination-bar').innerHTML = pageHTML;
}

async function updatePageAndDisplay() {
  url = `http://34.64.161.55:80/api/posts?id=notice&offset=${OFFSET}&pageNum=${currentPage}`;
  await fetchNotice();
  await showPagination();
}

async function movePage(pageNum) {
  if (pageNum > totalPage) return;
  //이동할 페이지가 이미 그 페이지라면
  if (currentPage === pageNum) return;
  currentPage = pageNum;
  await updatePageAndDisplay();
}

async function moveNextPage() {
  if (currentPage >= totalPage) return;
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

fetchNotice();
