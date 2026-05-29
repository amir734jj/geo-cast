import {Fragment, useEffect, useRef, useState} from 'react';
import Card from 'react-bootstrap/Card';
import {queryPosts, deletePost as deletePostAction} from '../../actions';
import {useAuthStore, useLocationStore, useMapFocusStore, usePostsStore} from "../../stores";
import InfiniteScroll from 'react-infinite-scroller';
import {Button, ButtonGroup, Spinner} from 'react-bootstrap';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPause, faPlay, faStop, faTrash, faForward} from "@fortawesome/free-solid-svg-icons";
import {DateTime} from "luxon";
import _ from "lodash";
import {useMediaQuery} from '../../utilities';
import Player, {EventType, PlayerInfoPropType} from "../player";
import {LinkContainer} from "react-router-bootstrap";
import {EntityType} from '@geo-cast/lib/dto/account';
import {combine} from "../../utilities";
import {PostInfoType} from '@geo-cast/lib/dto/board/post';
import ms from 'ms';
import {useConfirmModal} from '../common';
import {isAdmin as checkAdmin} from '@geo-cast/lib/utils';

type PlayerInfoType = Record<number, PlayerInfoPropType & {
  play: boolean,
  page: number,
} & EntityType & PostInfoType>;

type BoardType = {
  page: number,
  more: boolean,
  error: boolean,
  autoPlay: boolean,
  currentAutoPlaying: number,
  playerInfos: PlayerInfoType,
}

const stopAutoPlay = (board: BoardType): BoardType => {
  return {
    ...board,
    autoPlay: false,
    currentAutoPlaying: -1
  };
};

const hardStopPlaying = (board: BoardType): BoardType => {
  return {
    ...board,
    playerInfos: _.reduce(_.values(board.playerInfos), (acc, x) => ({...acc, [x.id]: {...x, play: false}}), {})
  };
};

const startAutoPlay = (board: BoardType): BoardType => {
  return combine(
    (x: BoardType) => ({...x, autoPlay: true}),
    playNextPost
  )(board);
};

const playNextPost = (board: BoardType): BoardType => {
  const ordered = orderPosts(board);
  const nextIndex = board.currentAutoPlaying + 1;
  if (board.autoPlay && nextIndex >= ordered.length) {
    return stopAutoPlay(board);
  } else {
    const nextPostId = ordered[nextIndex]?.id;
    return {
      ...board,
      currentAutoPlaying: nextIndex,
      playerInfos: _.reduce(_.values(board.playerInfos), (acc, x) => ({
        ...acc,
        [x.id]: {...x, play: nextPostId != null && nextPostId === x.id}
      }), {})
    };
  }
};

const orderPosts = (board: BoardType) => _.orderBy(board.playerInfos, ["page", "id"], ["asc", "desc"]);

const Posts = () => {
  const locationContext = useLocationStore();
  const mapFocusContext = useMapFocusStore();
  const authContext = useAuthStore();
  const isAdmin = checkAdmin(authContext?.auth?.roles);
  const isMobile = useMediaQuery('(max-width: 767px)');
  const {confirmAction, ConfirmModal} = useConfirmModal();

  const count = 2;
  const {appendPosts, clearPosts, removePost, refreshTrigger, triggerRefresh} = usePostsStore();

  const [scroll, setScrollRef] = useState<any>(null);
  const [board, setBoard] = useState<BoardType>({
    page: 1,
    more: false,
    error: false,
    autoPlay: false,
    currentAutoPlaying: -1,
    playerInfos: {}
  });
  const pageRef = useRef(board.page);

  const nextPage = async (queryPage: number) => {
    try {
      const {data} = await queryPosts(count, queryPage, mapFocusContext.coordinate ?? locationContext.coordinate ?? {
        latitude: 0,
        longitude: 0
      });
      appendPosts(data);
      setBoard(board => {
        pageRef.current = queryPage;
        return {
          ...board,
          page: queryPage,
          more: data.length === count,
          error: false,
          playerInfos: _.merge({}, board.playerInfos, _.reduce(data, (acc, x) => ({
            ...acc,
            [x.id]: { ...x, page: queryPage + 1}
          }), {}))
        };
      });
    } catch (e) {
      setBoard(board => ({...board, error: true}));
    }
  };

  useEffect(() => {
    if (mapFocusContext.coordinate) {
      clearPosts();
      nextPage(1);
    }
  }, [mapFocusContext.coordinate]);

  useEffect(() => {
    nextPage(1);
  }, []);

  useEffect(() => {
    if (refreshTrigger > 0) {
      clearPosts();
      nextPage(1);
    }
  }, [refreshTrigger]);

  useEffect(() => {
    const interval = setInterval(async () => {
      await Promise.all(_.range(1, pageRef.current + 1).map(x => nextPage(x)));
    }, ms("30s"));

    return () => clearInterval(interval);
  }, []);

  const mapEventToPlay = (event: EventType, prevPlay: boolean) => {
    switch (event) {
      case "pause":
      case "finish":
        return false;
      case "play":
        return true;
      default:
        return prevPlay;
    }
  };

  return (
    <Fragment>
      {Object.keys(board.playerInfos).length >= 3 ?
        <ButtonGroup className="mb-2 mt-1">
          {board.autoPlay ?
            <Button
              variant="outline-danger"
              size="sm"
              onClick={() => {
                setBoard(
                  combine(
                    stopAutoPlay,
                    hardStopPlaying));
              }}>
              <FontAwesomeIcon icon={faStop} className="me-1" />Stop Playlist
            </Button> :
            <Button
              variant="outline-success"
              size="sm"
              disabled={!!(_.find(_.values(board.playerInfos), {play: true}))}
              onClick={() => {
                setBoard(startAutoPlay);
              }}>
              <FontAwesomeIcon icon={faForward} className="me-1" />Play All
            </Button>}
        </ButtonGroup> : null}
      <div className="posts-scroll" style={{height: '60vh', maxHeight: '37rem', overflowY: 'auto'}} ref={(ref) => setScrollRef(ref)}>
        <InfiniteScroll
          pageStart={0}
          loadMore={(page) => nextPage(page)}
          hasMore={board.more && !board.error}
          loader={<Spinner key="spinner-post"/>}
          useWindow={false}
          getScrollParent={() => scroll}
        >
          {_.map(orderPosts(board)).filter(post => post.user).map((post) => (
            <Card key={`post-${post.id}`} style={{marginBottom: '0.5rem'}}>
              <Card.Body style={{padding: '0.75rem'}}>
                <Card.Title as="p">
                  {authContext.auth ?
                    <LinkContainer to={`/profile/${post.user.id}`}>
                      <a>{post.user.name}</a>
                    </LinkContainer> : post.user.name}
                </Card.Title>
                <Card.Subtitle
                  className="mb-2 text-muted">
                  {Number(post.duration).toFixed(2)}sec
                  - {DateTime.fromISO(post.createdAt.toString()).toLocaleString(DateTime.DATETIME_MED)}
                </Card.Subtitle>
                <Player
                  mediaBlobUrl={`/api/board/download/${post.recordingId}`}
                  play={board.playerInfos[post.id]?.play}
                  showWaveform={!isMobile}
                  onChange={(playerInfo: Partial<PlayerInfoPropType>, event: EventType) => {
                    setBoard(
                      combine(
                        (x: BoardType) => ({
                          ...x,
                          playerInfos: _.reduce(_.values(x.playerInfos), (acc, {play, ...info}) => {
                            if (info.id === post.id) {
                              return {
                                ...acc,
                                [info.id]: {
                                  ...info,
                                  ...playerInfo,
                                  play: mapEventToPlay(event, play)
                                },
                              };
                            } else {
                              return ({
                                ...acc,
                                [info.id]: {
                                  ...info,
                                  play
                                },
                              });
                            }
                          }, {})
                        }),
                        (x: BoardType) => {
                          if (event === "finish" && x.autoPlay) {
                            return playNextPost(x);
                          } else {
                            return x;
                          }
                        }
                      )
                    );
                  }}/>
                {board.playerInfos[post.id]?.playing
                  ? <Button variant="outline-secondary" title="pause-recording" onClick={() => {
                    setBoard(
                      combine(
                        stopAutoPlay,
                        hardStopPlaying));
                  }}>
                    <FontAwesomeIcon icon={faPause} beatFade/>
                  </Button> : <Button variant="outline-primary" title="play-recording" onClick={() => {
                    setBoard(
                      combine(
                        stopAutoPlay,
                        (x: BoardType) => ({
                          ...x,
                          playerInfos: _.reduce(_.values(x.playerInfos), (acc, y) => ({
                            ...acc,
                            [y.id]: {...y, play: y.id === post.id}
                          }), {})
                        })));
                  }}>
                    <FontAwesomeIcon icon={faPlay}/>
                  </Button>}
                {isAdmin ?
                  <Button variant="outline-danger" size="sm" className="ms-2" title="delete-recording"
                    disabled={board.autoPlay || !!(_.find(_.values(board.playerInfos), {play: true}))}
                    onClick={async () => {
                      if (await confirmAction('This will permanently delete the recording.')) {
                        await deletePostAction(post.id);
                        removePost(post.id);
                        setBoard(prev => {
                          const { [post.id]: _, ...rest } = prev.playerInfos;
                          return { ...prev, playerInfos: rest };
                        });
                        triggerRefresh();
                      }
                    }}>
                    <FontAwesomeIcon icon={faTrash}/>
                  </Button> : null}
              </Card.Body>
            </Card>
          ))}
        </InfiniteScroll>
      </div>
      <ConfirmModal />
    </Fragment>
  );
};

export default Posts;
