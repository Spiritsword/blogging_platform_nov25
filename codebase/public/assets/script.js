let token = localStorage.getItem("authToken");

//Id of post that is being edited. ("-1" means no post is being edited.)
let editPostId = -1;
let editPost = null;
let selectedCategoryId = null;

//Auth Container Functionality

function register() {
  const username = document.getElementById("username").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  fetch("http://localhost:3001/api/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.errors) {
        alert(data.errors[0].message);
      } else {
        alert("User registered successfully");
      }
      // Hide the auth container and show the app container as we're now logged in
      swapToAppContainer();
    })
    .catch((error) => {
      console.log(error);
    });
}

function login() {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;
  fetch("http://localhost:3001/api/users/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  })
    .then((res) => res.json())
    .then((data) => {
      // Save the token in the local storage
      if (data.token) {
        localStorage.setItem("authToken", data.token);
        token = data.token;
        alert("User Logged In successfully");

        // Hide the auth container and show the app container as we're now logged in
        swapToAppContainer();

      } else {
        alert(data.message);
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

//App Container Functionality

function createCategory() {
  const name = document.getElementById("category-name").value;
  console.log(name)
  fetch("http://localhost:3001/api/categories", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({name})
  })
  .then((res) => res.json())
  .then(() => {
    alert("Category created successfully");
    appContainerRefresh();
  })
  .catch((error) => {
    console.log(error);
  });
}

function logout() {
  fetch("http://localhost:3001/api/users/logout", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  })
  .then(() => {
    // Clear the token from the local storage as we're now logged out
    localStorage.removeItem("authToken");
    token = null;
    document.getElementById("auth-container").classList.remove("hidden");
    document.getElementById("app-container").classList.add("hidden");
  })
  .catch((error) => {
  console.log(error);
  });
}

function createPost() {
  const title = document.getElementById("createPost-title").value;
  const content = document.getElementById("createPost-content").value;
  const categoryId = parseInt(document.getElementById("createPost-category").value);
  console.log({ title, content, categoryId });  
  fetch("http://localhost:3001/api/posts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({title, content, categoryId}),
  })
  .then((res) => res.json())
  .then(() => {
    alert("Post created successfully");
    appContainerRefresh();
  })
  .catch((error) => {
    console.log(error);
  });
}

//Helper Functions

function swapToAppContainer () {
  document.getElementById("auth-container").classList.add("hidden");
  document.getElementById("app-container").classList.remove("hidden");
  appContainerRefresh();
}

function appContainerRefresh () {
  populateCategories();
  populatePosts();
}

async function populatePosts() {
  try{
    const [posts, users, categories] = await Promise.all([
    fetch("http://localhost:3001/api/posts", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((res) => res.json())
    .catch((error) => {
      console.log(error);
    }),
    fetch("http://localhost:3001/api/users", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((res) => res.json())
    .catch((error) => {
      console.log(error);
    }),
    fetch("http://localhost:3001/api/categories", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((res) => res.json())
    .catch((error) => {
      console.log(error);
    })
    ]);
  
    showPosts(posts, users, categories);
  }
  catch (error) {
    console.error('Error fetching data:', error);
    return null;
  }
}

function populateCategories() {
  try{
    response = fetch("http://localhost:3001/api/categories", {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => response.json())
    .then((categories) => {
      showPostCategoryDropdown(categories, "createPost-category");
      showPostCategoryDropdown(categories, "updatePost-category");
      showPostCategoryDropdown(categories, "selectFilter-category");
    })
  }
  catch {
    console.log(response.status);
  }
}

function showPostCategoryDropdown (categories, categorySelectContainerName){
      if(document.getElementById(categorySelectContainerName) != null) {
      const categoriesSelectContainer = document.getElementById(categorySelectContainerName);
      categoriesSelectContainer.innerHTML = "";
      categories.forEach((category) => {
        var option = document.createElement("option");
        option.innerHTML = `${category.name}`;
        option.setAttribute("value", category.id);
        categoriesSelectContainer.appendChild(option);
      });
    }
  }

function showCategoryFilterDropdown(categories){}

function showPosts (posts, users, categories){
  const postsContainer = document.getElementById("posts");
  postsContainer.innerHTML = "";
  posts.forEach((post) => {
    const div = document.createElement("div");
    generatePost(postsContainer, post, div, users, categories);
  })
  //Populate edit form (if it exists) with current values for the post.
  if (editPostId != -1) {
  populateCategories();
  document.getElementById("updatePost-title").value = editPost.title;
  document.getElementById("updatePost-category").value = editPost.categoryId;
  document.getElementById("updatePost-content").value = editPost.content;
  }
}

function generatePost(postsContainer, post, div, users, categories){
  if (selectedCategoryId != null && selectedCategoryId != post.categoryId) {
    return;
  }
  const postNode = document.createElement("div");
  const editButton = document.createElement("button");
  const updateButton = document.createElement("button");
  const deleteButton = document.createElement("button");
  let thisUser = null;
  let thisCategory = null;
  users.forEach(user => {if (post.userId == user.id) {thisUser = user}});
  categories.forEach(category => {if (post.categoryId == category.id) {thisCategory = category}});
  deleteButton.addEventListener("click", function() {
    deletePost(post);
    appContainerRefresh();
  })
  deleteButton.innerText = "Delete";
  //If post is not set to edit mode, present as normal.
  if (post.id != editPostId) {
    postNode.innerHTML = `<h3>${post.title}</h3><p>${
      post.content
    }</p><small>By: ${thisUser.username} on ${new Date(
      post.createdOn
    ).toLocaleString()}</small><br>
    <small>Category: ${thisCategory.name}}</small>`
    editButton.addEventListener("click", function() {
      editPostId = post.id;
      appContainerRefresh();
    });
    editButton.innerText = "Edit";
    div.appendChild(postNode);
    div.appendChild(editButton);
    div.appendChild(deleteButton);
  } else {
    //If post is set to edit mode, present post as form (similar to that for create post input).
    editPost = post; //Needed later to populate edit form with current values.
    postNode.innerHTML = `
      <input type="text" id="updatePost-title">
      <select name="category" id="updatePost-category">
        <!-- Categories will be populated here -->
      </select>
      <textarea id="updatePost-content"></textarea>`
    updateButton.addEventListener("click", function() {
      updatePost();
      appContainerRefresh();
    })
    updateButton.innerText = "Update";
    div.appendChild(postNode);
    div.appendChild(updateButton);
    div.appendChild(deleteButton);
  }
  postsContainer.appendChild(div);
}

function updatePost() {
    const title = document.getElementById("updatePost-title").value;
    const content = document.getElementById("updatePost-content").value;
    const categoryId = parseInt(document.getElementById("updatePost-category").value);
    const body = JSON.stringify({title, content, categoryId});
    fetch(`http://localhost:3001/api/posts/${editPostId}`, {      
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}` },
    body: JSON.stringify({title, content, categoryId}),
  })
  .then((res) => res.json())
  .then(() => {
    editPostId = -1;
    appContainerRefresh();
  })
}

function filterByCategory() {
  selectedCategoryId = document.getElementById("selectFilter-category").value;
  appContainerRefresh();
}

function cancelCategoryFilter() {
  selectedCategoryId = null;
  appContainerRefresh();
}

function deletePost(post){
    fetch(`http://localhost:3001/api/posts/${post.id}`, {      
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
  })
  .then((res) => res.json())
  .then(() => {
    appContainerRefresh();
  })
}

//Main Function

/*** ARCHIVE

function fetchCategories() {
  fetch("http://localhost:3001/api/categories", {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((res) => res.json())
    .then((categories) => {
      const categoriesContainer = document.getElementById("categories");
      categoriesContainer.innerHTML = "";
      categories.forEach((category) => {
        const div = document.createElement("div");
        const categoryIdNode = document.createElement("div");
        const categoryNameNode = document.createElement("div");
        //Note styling
        div.className = "row pb-3";
        categoryIdNode.className = "col-1";
        categoryIdNode.innerHTML = `<h5>${category.id}</h5>`;
        categoryNameNode.className = "col-11";
        categoryNameNode.innerHTML = `<h5>${category.name}</h5>`;
        div.appendChild(categoryIdNode);
        div.appendChild(categoryNameNode);
        categoriesContainer.appendChild(div);
      })
    })
    .catch((error) => {
      console.log(error);
    });
}

***/