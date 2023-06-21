import { PostInfoType } from '@geo-cast/lib/dto/board';
import { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import { queryPosts } from '../../actions';

const Posts = () => {
  const [count] = useState(5);
  const [page, setPage] = useState(1);
  const [posts, setPosts] = useState<PostInfoType[]>([]);

  useEffect(() => {
    queryPosts(count, page).then(resp => {
      setPosts([...posts, ...resp.data]);
    });
  }, []);

  const nextPage = () => {
    queryPosts(count, page + 1).then(resp => {
      setPosts([...posts, ...resp.data]);
      setPage(page + 1);
    });
  }

  return (
    posts.map((post, i) => (
      <Card key={i}>
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


import useInfiniteScroll from 'react-infinite-scroll-hook';
import { List, ListItem } from 'react-bootstrap';
import { Spinner } from 'react-bootstrap';

function SimpleInfiniteList() {
  const { loading, items, hasNextPage, error, loadMore } = useLoadItems();

  const [sentryRef] = useInfiniteScroll({
    loading,
    hasNextPage,
    onLoadMore: loadMore,
    // When there is an error, we stop infinite loading.
    // It can be reactivated by setting "error" state as undefined.
    disabled: !!error,
    // `rootMargin` is passed to `IntersectionObserver`.
    // We can use it to trigger 'onLoadMore' when the sentry comes near to become
    // visible, instead of becoming fully visible on the screen.
    rootMargin: '0px 0px 400px 0px',
  });

  return (
    <List>
      {items.map((item) => (
        <ListItem key={item.key}>{item.value}</ListItem>
      ))}
      {/* 
          As long as we have a "next page", we show "Loading" right under the list.
          When it becomes visible on the screen, or it comes near, it triggers 'onLoadMore'.
          This is our "sentry".
          We can also use another "sentry" which is separated from the "Loading" component like:
            <div ref={sentryRef} />
            {loading && <ListItem>Loading...</ListItem>}
          and leave "Loading" without this ref.
      */}
      {(loading || hasNextPage) && (
        <ListItem ref={sentryRef}>
          <Spinner />
        </ListItem>
      )}
    </List>
  );
}
