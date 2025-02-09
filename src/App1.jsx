import axios from 'axios';
import { useEffect, useState } from 'react';

function App1() {
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

export default App1;
