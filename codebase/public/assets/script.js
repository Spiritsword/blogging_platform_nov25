let token = localStorage.getItem("authToken");

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
      document.getElementById("auth-container").classList.add("hidden");
      document.getElementById("app-container").classList.remove("hidden");
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

        // Fetch the categories list
        fetchCategories();
        // Fetch the posts list
        fetchPosts();

        // Hide the auth container and show the app container as we're now logged in
        document.getElementById("auth-container").classList.add("hidden");
        document.getElementById("app-container").classList.remove("hidden");

        generateCategoryOptions();
      } else {
        alert(data.message);
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

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
    fetchCategories();
  })
  .catch((error) => {
    console.log(error);
  });
}

function generateCategoryOptions() {
  try{
    response = fetch("http://localhost:3001/api/categories", {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => response.json())
    .then((categories) => {
      console.log(categories);
      const categoriesSelectContainer = document.getElementById("post-category");
      categoriesSelectContainer.innerHTML = "";
      categories.forEach((category) => {
        console.log(category);
        const option = document.createElement("option");
        option.innerHTML = `${category.name}`;
        option.setAttribute("value", category.id);
        categoriesSelectContainer.appendChild(option);
      });
    })
  }
  catch {
    console.log(response.status);
  }
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

function fetchPosts() {
  fetch("http://localhost:3001/api/posts", {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  })
  .then((res) => res.json())
  .then((posts) => {
      const postsContainer = document.getElementById("posts");
      postsContainer.innerHTML = "";
      posts.forEach((post) => {
        const div = document.createElement("div");
        div.innerHTML = `<h3>${post.title}</h3><p>${
          post.content
        }</p><small>By: ${post.postedBy} on ${new Date(
          post.createdOn
        ).toLocaleString()}</small>`;
        postsContainer.appendChild(div);
      })
    })
    .catch((error) => {
      console.log(error);
    })
}

function createPost() {
  const title = document.getElementById("post-title").value;
  const content = document.getElementById("post-content").value;
  const categoryId = document.getElementById("post-category").value;
  fetch("http://localhost:3001/api/posts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ title, content, categoryId, userId: "User" }),
  })
  .then((res) => res.json())
  .then(() => {
    alert("Post created successfully");
    fetchPosts();
  })
  .catch((error) => {
    console.log(error);
  });
}
