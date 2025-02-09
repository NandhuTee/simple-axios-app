**1\. Axios vs Fetch vs Async/Await vs Promise in React**

| **Feature** | **Axios** | **Fetch** | **Async/Await** | **Promise** |
| --- | --- | --- | --- | --- |
| **Definition** | A third-party library for making HTTP requests | A built-in JavaScript API for making HTTP requests | A modern syntax for handling promises in a synchronous way | An object representing the eventual completion/failure of an asynchronous operation |
| **Ease of Use** | Easier to use, has built-in JSON support and automatic request cancellation | Slightly more verbose, requires response.json() to parse JSON | Simplifies handling of Promise chains | Requires .then() and .catch() to handle responses/errors |
| **Error Handling** | Automatically rejects if the request fails | Does not reject on HTTP errors (e.g., 404, 500), needs manual error handling | Uses try...catch for better error handling | Uses .catch() to handle errors |
| **Default Headers** | Automatically sends JSON headers | No default headers; you need to set them manually | Works with both Fetch and Axios | Works with Fetch and Axios |
| **Interceptors** | Yes, allows request/response interception | No built-in interceptors | Can be used inside an async function | Works with .then() and .catch() |
| **Request Cancellation** | Supports cancellation using CancelToken | No built-in request cancellation | Can use AbortController with Fetch | Cannot cancel once a Promise starts executing |
| **File Uploads** | Supports progress tracking (onUploadProgress) | Requires extra configuration for progress tracking | Can be used with Axios or Fetch | Can handle async file uploads |
| **Performance** | Slightly larger since it’s a library | Native API, lightweight | Not a separate API; just syntactic sugar | Core part of JavaScript |

**2\. When to Use What in React?**

| **Scenario** | **Best Choice** |
| --- | --- |
| Simple API requests | Fetch (built-in, no need for extra dependencies) |
| Handling large data | Axios (automatic JSON parsing, better performance for large responses) |
| Error handling | Axios (automatically rejects failed requests) |
| Request cancellation | Axios (has built-in support) or Fetch with AbortController |
| File uploads | Axios (built-in progress tracking) |
| Cleaner async code | Async/Await (makes the code more readable) |
| Complex API requests (headers, authentication, interceptors) | Axios (easier to manage) |
| Chained API calls | Promises (efficient when calling multiple APIs sequentially) |

**3\. Code Examples in React**

**Using Fetch (Basic Example)**

```javascript

useEffect(() => {
  fetch("https://api.example.com/data")
    .then(response => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then(data => console.log(data))
    .catch(error => console.error("Fetch error:", error));
}, []);

```
**Using Axios**

```javascript

import axios from "axios";

useEffect(() => {
  axios.get("https://api.example.com/data")
    .then(response => console.log(response.data))
    .catch(error => console.error("Axios error:", error));
}, []);

```
**Using Async/Await with Fetch**

```javascript

useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await fetch("https://api.example.com/data");
      if (!response.ok) throw new Error("Failed to fetch");
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };
  fetchData();
}, []);

```
**Using Async/Await with Axios**

```javascript

import axios from "axios";

useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await axios.get("https://api.example.com/data");
      console.log(response.data);
    } catch (error) {
      console.error("Axios error:", error);
    }
  };
  fetchData();
}, []);

```
**Using Promises**

```javascript

const fetchData = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const data = { message: "Hello, world!" };
      resolve(data);
    }, 2000);
  });
};

useEffect(() => {
  fetchData()
    .then(data => console.log(data))
    .catch(error => console.error(error));
}, []);

```
**4\. Conclusion**

- If you need **simple requests** → fetch
- If you need **better error handling, interceptors, and request cancellation** → axios
- If you need **clean and readable code** → async/await
- If you need **to chain multiple async operations** → promises

**Real-World Use Case: Authentication API Request**

Let’s consider a scenario where we need to:  
✅ Make a **POST request** to log in a user  
✅ Handle **errors properly**  
✅ Store **authentication token**  
✅ Use **interceptors** (only possible in Axios)

**1️⃣ Using Fetch (Manual JSON Parsing + Error Handling)**

```javascript

const loginUser = async (email, password) => {
  try {
    const response = await fetch("https://api.example.com/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error("Login failed! Incorrect credentials.");
    }

    const data = await response.json();
    localStorage.setItem("token", data.token);
    console.log("Login successful:", data);
  } catch (error) {
    console.error("Fetch error:", error.message);
  }
};

// Call the function
loginUser("test@example.com", "password123");

```
**❌ Problems with Fetch**

- **Manual error handling** (!response.ok check required)
- **No built-in request cancellation**
- **No interceptors for automatic token handling**

**2️⃣ Using Axios (Cleaner Code + Built-in Error Handling)**

```javascript

import axios from "axios";

const loginUser = async (email, password) => {
  try {
    const response = await axios.post("https://api.example.com/login", {
      email,
      password,
    });

    localStorage.setItem("token", response.data.token);
    console.log("Login successful:", response.data);
  } catch (error) {
    console.error("Axios error:", error.response?.data || error.message);
  }
};

// Call the function
loginUser("test@example.com", "password123");

```
**✅ Why Axios is Better Here?**

✔ **Automatic JSON conversion** (no response.json())  
✔ **Auto-rejects failed requests** (unlike Fetch)  
✔ **Easier error handling** (error.response gives server response)

**3️⃣ Using Axios with Interceptors (Automatic Token Management)**

When making multiple requests, we **automatically attach the token** in headers using **interceptors**.

```javascript

import axios from "axios";

// Create an Axios instance with default settings
const api = axios.create({
  baseURL: "https://api.example.com",
  headers: { "Content-Type": "application/json" },
});

// Add interceptor to include token in requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

const loginUser = async (email, password) => {
  try {
    const response = await api.post("/login", { email, password });
    localStorage.setItem("token", response.data.token);
    console.log("Login successful:", response.data);
  } catch (error) {
    console.error("Axios error:", error.response?.data || error.message);
  }
};

// Call function
loginUser("test@example.com", "password123");

```
**🔥 Benefits of Axios Interceptors**

✔ **Automatically attaches token** to every request  
✔ **Centralized API error handling**  
✔ **Easier to manage multiple requests**

**4️⃣ Using Fetch with AbortController (Request Cancellation)**

To **cancel a request** (useful in search/autocomplete), we use AbortController.

```javascript

const controller = new AbortController();
const { signal } = controller;

const loginUser = async (email, password) => {
  try {
    const response = await fetch("https://api.example.com/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      signal,
    });

    if (!response.ok) {
      throw new Error("Login failed!");
    }

    const data = await response.json();
    console.log("Login successful:", data);
  } catch (error) {
    if (error.name === "AbortError") {
      console.warn("Request was cancelled.");
    } else {
      console.error("Fetch error:", error.message);
    }
  }
};

// Cancel request if needed
controller.abort();
```

**🚨 Why Use AbortController?**

- Prevents **memory leaks**
- Useful for **search & autocomplete** requests

**5️⃣ Using Promises for Sequential API Calls (Chaining)**

Example: **First login**, then **fetch user profile**.

```javascript

const loginUser = (email, password) => {
  return axios.post("https://api.example.com/login", { email, password });
};

const getUserProfile = (token) => {
  return axios.get("https://api.example.com/user", {
    headers: { Authorization: `Bearer ${token}` },
  });
};

loginUser("test@example.com", "password123")
  .then((response) => {
    console.log("Login successful:", response.data);
    return getUserProfile(response.data.token);
  })
  .then((profileResponse) => {
    console.log("User profile:", profileResponse.data);
  })
  .catch((error) => {
    console.error("Error:", error.response?.data || error.message);
  });
```

**🌟 Why Use Promises?**

✔ **Easier sequential requests**  
✔ **Better for dependent API calls**

**📌 Summary: Which One to Use?**

| **Scenario** | **Best Choice** |
| --- | --- |
| Basic API Calls | Fetch |
| Better Error Handling | Axios |
| Auto JSON Parsing | Axios |
| Request Cancellation | Fetch (AbortController) |
| Automatic Token Management | Axios (interceptors) |
| File Uploads | Axios (onUploadProgress) |
| Sequential API Calls | Promises (.then()) |
| Cleanest Async Code | Async/Await |

**🚀 Conclusion: Axios is Better for Most Cases**

✔ **Easier syntax**  
✔ **Better error handling**  
✔ **Built-in JSON parsing**  
✔ **Interceptors for token management**

However, **Fetch is good** when:  
✅ You need **a lightweight option**  
✅ You don’t want **extra dependencies**

**Pagination in React**

**1\. What is Pagination?**

Pagination is a technique used to break large datasets into smaller, more manageable chunks by displaying only a specific number of items per page.

**2\. Why Use Pagination?**

- Improved performance when rendering large data.
- Enhanced user experience with better readability.
- Faster page loading times.
- **Difference Between With Pagination and Without Pagination**

| **Aspect** | **Without Pagination** | **With Pagination** |
| --- | --- | --- |
| **Data Handling** | Fetches all data at once. | Fetches data in chunks (per page). |
| **Performance** | Slower for large datasets. | Faster and more efficient. |
| **Memory Usage** | High memory consumption. | Lower memory usage. |
| **User Experience** | User scrolls endlessly or waits. | User navigates page by page. |
| **API Load** | More load on the backend server. | Lower load on the backend server. |

**Code Examples**

**Without Pagination (Axios Example)**

Fetches all posts in one go:

```javascript

import axios from 'axios';
import { useEffect, useState } from 'react';

function App() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axios.get('https://jsonplaceholder.typicode.com/posts')
      .then(response => setPosts(response.data))
      .catch(error => console.error('Error:', error));
  }, []);

  return (
    <ul>
      {posts.map(post => <li key={post.id}>{post.title}</li>)}
    </ul>
  );
}

export default App;
```

**With Pagination (Axios Example)**

Fetches posts in chunks, improving performance:

```javascript



import axios from 'axios';
import { useEffect, useState } from 'react';

function App() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const postsPerPage = 5;

  useEffect(() => {
    axios.get(`https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=${postsPerPage}`)
      .then(response => setPosts(response.data))
      .catch(error => console.error('Error:', error));
  }, [page]);

  return (
    <div>
      <ul>
        {posts.map(post => <li key={post.id}>{post.title}</li>)}
      </ul>
      <button onClick={() => setPage(page => page > 1 ? page - 1 : page)}>Previous</button>
      <button onClick={() => setPage(page + 1)}>Next</button>
    </div>
  );
}

export default App;
```