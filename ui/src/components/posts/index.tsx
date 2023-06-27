import {useEffect, useState} from 'react';
import Card from 'react-bootstrap/Card';
import {queryPosts} from '../../actions';
import {useLocationStore, useMapFocusStore, usePostsStore} from "../../stores";
import InfiniteScroll from 'react-infinite-scroller';
import {Button, Spinner} from 'react-bootstrap';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPause, faPlay} from "@fortawesome/free-solid-svg-icons";
import { DateTime } from "luxon";
import _ from "lodash";
import LazyPlayer from "../lazyPlayer";

const Posts = () => {
  const locationContext = useLocationStore();
  const mapFocusContext = useMapFocusStore();

  const count = 2;
  const [page, setPage] = useState(0);
  const { posts, setPosts, clearPosts } = usePostsStore();
  const [more, setMore] = useState(true);
  const [error, setError] = useState(true);
  const [scrollRef, setScrollRef] = useState<any>(null);

  const nextPage = async (currentPage: number | null = null) => {
    currentPage = _.isNull(currentPage) ? page : currentPage;
    try {
      const {data} = await queryPosts(count, currentPage + 1, mapFocusContext.coordinate ?? locationContext.coordinate ?? {latitude: 0, longitude: 0});
      setPosts(data, currentPage + 1);
      setPage(currentPage + 1);
      setMore(data.length === count);
      setError(false);
    } catch (e) {
      setError(true);
    }
  }

  useEffect(() => {
    nextPage();
  }, [locationContext.coordinate]);

  useEffect(() => {
    if (mapFocusContext.coordinate) {
      clearPosts();
      setPage(0);
      nextPage(0);
    }
  }, [mapFocusContext.coordinate])

  return (
    <>
      <div style={{ height: '37rem', overflowY: 'auto'}} ref={(ref) => setScrollRef(ref)}>
        <InfiniteScroll
          pageStart={0}
          loadMore={() => nextPage()}
          hasMore={more && !error}
          loader={<Spinner/>}
          useWindow={false}
          getScrollParent={() => scrollRef}
        >
          {_.flatten(posts).filter(_.identity).map((post, i) => (
            <Card key={i} style={{marginBottom: '0.5rem'}}>
              <Card.Body style={{ padding: '0.5rem 0.5rem'}}>
                <Card.Title as="p">{post.user.name}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">{DateTime.fromISO(post.created_at).toLocaleString(DateTime.DATETIME_MED)}</Card.Subtitle>
                <LazyPlayer
                  mediaBlobUrl={`/api/board/download/${post.recordingId}`}
                  render={(controls) => {
                    return controls.playing ? (
                      <Button variant="outline-secondary" title="pauseRecording" onClick={async () => {
                        await controls.pause();
                      }}>
                        <FontAwesomeIcon icon={faPause} beatFade/>
                      </Button>) : (<Button variant="outline-primary" title="play-recording" onClick={async () => {
                        await controls.play();
                      }}>
                        <FontAwesomeIcon icon={faPlay}/>
                      </Button>
                    );
                  }}/>
              </Card.Body>
            </Card>
          ))}
        </InfiniteScroll>
      </div>
    </>
  );
}

export default Posts;
