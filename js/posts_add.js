const post_title = document.querySelector("#title");
const post_content = document.querySelector("#content");
let category;

async function postSubmit(){

    const sendData={
        title : post_title.value,
        content: post_content.value,
        userId: 1,
        category : category
    };

    const options = {
        method : 'POST',
        headers : {
            'Content-Type' : 'application/json'
        },
        body : JSON.stringify(sendData)
    };

    const response = await fetch('http://34.64.161.55:8001/posts', options);
    const result = await response.json();
    console.log(result);

    if(result.status ===201){
        window.location.href = '../html/posts.html';
    }
    else{
        console.log(result.message);
    }
}

function checkedCategory(e){
    if(e.target.innerText === "스터디"){
        category="study";
    }
    else if(e.target.innerText === "동아리 활동"){
        category="memory";
    }

    const btnText = document.querySelector("#category-button");
    btnText.innerText = e.target.innerText;

}

