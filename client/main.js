const input = document.querySelector('#comment-input');
const submitButton = document.querySelector('#comment-submit');

const baseUrl = "http://localhost:8899/api";

const getComments = async () => {
    const comments = await fetch(baseUrl + '/comments').then(res => res.json());
    console.log(comments)
}

submitButton.addEventListener('click', (e) => {
  e.preventDefault();
  const comment = input.value;
  console.log(comment)
})

getComments()