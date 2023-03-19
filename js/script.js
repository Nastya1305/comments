document.getElementById('comment-date').valueAsNumber = Date.now();

let comments = [];
loadComments();

document.getElementById('comment-add').onclick = function () {
   let userName = document.getElementById('user-name');
   let commentText = document.getElementById('comment-text');
   let commentDate = document.getElementById('comment-date');

   clearErrorMessage(userName);
   clearErrorMessage(commentText);

   if (!chekInput(userName) || !chekInput(commentText)) return false;


   let comment = {
      userName: userName.value,
      text: commentText.value,
      isLiked: false,
      dateTime: setCurrentTimeForDate(new Date(commentDate.value || Date.now()))
   }

   userName.value = '';
   commentText.value = '';
   commentDate.value = '';
   commentDate.valueAsNumber = Date.now();

   comments.push(comment);

   saveComments();
   showComments();
};

document.getElementById('comment-clear').onclick = function () {
   let userName = document.getElementById('user-name');
   let commentText = document.getElementById('comment-text');
   let commentDate = document.getElementById('comment-date');

   userName.value = '';
   commentText.value = '';
   commentDate.value = '';
   commentDate.valueAsNumber = Date.now();

   clearErrorMessage(userName);
   clearErrorMessage(commentText);
};


document.body.querySelector(".discussions__list").onclick = function (event) {
   let commentWidgets = Array.from(this.children).reverse();

   if (event.target.closest(".comment-widget__delete-btn")) {
      let index = commentWidgets.indexOf(event.target.closest(".discussions__row"));
      comments.splice(index, 1);

      saveComments();
      showComments();
   }


   if (event.target.closest(".comment-widget__like-btn")) {
      let index = commentWidgets.indexOf(event.target.closest(".discussions__row"));
      comments[index].isLiked = !comments[index].isLiked;

      saveComments();
      showComments();
   }
};

function chekInput(field) {
   if (!field.value) {
      field.classList.add("error");
      field.previousElementSibling.textContent = "Это поле должно быть заполнено!";
      return false;
   }
   return true;
}

function clearErrorMessage(field) {
   field.classList.remove("error");
   field.previousElementSibling.textContent = "";
}



function showComments() {
   let commentsList = document.querySelector(".discussions__list");
   commentsList.innerHTML = "";

   comments.forEach(function (comment) {
      let commentsListRow = document.createElement("div");
      commentsListRow.className = "discussions__row";
      createCommentWidget(comment, commentsListRow);
      commentsList.prepend(commentsListRow);
   });
}

function saveComments() {
   localStorage.setItem('comments', JSON.stringify(comments));
}

function loadComments() {

   if (localStorage.getItem('comments')) {
      comments = JSON.parse(localStorage.getItem('comments'), (key, value) => {
         if (key == "dateTime") return new Date(value);
         return value;
      });
   }

   showComments();
}



function createCommentWidget(comment, parrentNode) {
   let html = `<div class="discussions__comment-widget comment-widget">
      <div class="comment-widget__body">
         <div class="comment-widget__header">
            <div class="comment-widget__row">
               <div class="comment-widget__user">${comment.userName}</div>
               <time class="comment-widget__date">
                  ${formatDateTime(comment.dateTime)}
               </time>
               <button class="comment-widget__delete-btn">
                  <svg class="icon icon_delete">
                     <use href="img/icons.svg#delete"></use>
                  </svg>
               </button>
            </div>

         </div>
         <div class="comment-widget__content">
            <div class="comment-widget__comment">
               ${comment.text}
            </div>
         </div>
      </div>
      <div class="comment-widget__footer">
         <button class="comment-widget__like-btn">
            <svg class="icon icon_like ${comment.isLiked ? "selected" : ""} ">
               <use href="img/icons.svg#like"></use>
            </svg>
         </button>
      </div>
   </div>`;
   parrentNode.innerHTML = html;
}



function setCurrentTimeForDate(date) {
   let now = new Date();
   date.setHours(now.getHours());
   date.setMinutes(now.getMinutes());
   return date;
}

function formatDateTime(dateTime) {
   let hour = ("0" + dateTime.getHours()).slice(-2);
   let min = ("0" + dateTime.getMinutes()).slice(-2);

   let diffDays = (Date.now() - dateTime.getTime()) / 8.64e+7;
   if (diffDays < 1) { return "Сегодня, " + hour + ':' + min };
   if (diffDays < 2) { return "Вчера, " + hour + ':' + min };

   let months = ['янв.', 'февр.', 'марта', 'апр.', 'мая', 'июня', 'июля', 'авг.', 'сент.', 'окт.', 'нояб.', 'дек.'];
   let year = dateTime.getFullYear();
   let month = months[dateTime.getMonth()];
   let date = dateTime.getDate();

   return date + ' ' + month + ' ' + year + ', ' + hour + ':' + min;
}

