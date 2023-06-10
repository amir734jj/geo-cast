import { PostInfoType } from '@geo-cast/lib/dto/board';
import { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import { queryPosts } from '../../actions';

const Posts = () => {
  const [posts, setPosts] = useState<PostInfoType[]>([]);

  useEffect(() => {
    queryPosts().then(resp => {
      setPosts(resp.data);
    });
  }, []);

  return (
    posts.map((post, i) => (
      <Card>
        <Card.Header>{post.recordingId}</Card.Header>
        <Card.Body>
          <Card.Title>Special title treatment</Card.Title>
          <Card.Text>
            With supporting text below as a natural lead-in to additional content.
          </Card.Text>
        </Card.Body>
      </Card>
    ))
  );
}

export default Posts;