import { EXCEPTION_MESSAGE } from '../../constant.js';
import Component from '../../core/Component.js';
import { rootStore } from '../../store/rootStore.js';
import NotFound from '../SearchModal/NotFound.js';
import SavedVideoCardList from './SavedVideoCardList.js';
import { savedVideosStorage } from '../../localStorage/savedVideos';

export default class MainPage extends Component {
  setup() {
    this.state = { watchedMode: false };

    rootStore.setState({
      savedVideos: savedVideosStorage.load(),
      hasWatchedVideo: savedVideosStorage.hasWatchedVideo(),
      hasWatchingVideo: savedVideosStorage.hasWatchedVideo(),
    });
  }

  template() {
    const { watchedMode } = this.state;
    return `
      <h1 class="classroom-container__title">π©π»βπ» λλ§μ μ νλΈ κ°μμ€ π¨π»βπ»</h1>
      <nav class="nav">
        <span class="nav-left">
          <button type="button" name="watching" class="button nav-left__button ${
            watchedMode ? '' : 'active'
          }">
            ποΈ λ³Ό μμ
          </button>
          <button type="button" name="watched" class="button nav-left__button ${
            watchedMode ? 'active' : ''
          }">
            β λ³Έ μμ
          </button>
        </span>
        <button type="button" id="search-modal-button" class="button nav__button">
          π κ²μ
        </button>
      </nav>
      ${
        this.shouldShowNotFound()
          ? `
          <section
            id="not-found"
            class="search-result search-result--no-result"
          ></section>
        `
          : `
          <ul id="saved-video-list" class="video-list"></ul>
        `
      }
    `;
  }

  afterMounted() {
    const { watchedMode } = this.state;

    if (this.shouldShowNotFound()) {
      new NotFound(this.$('#not-found'), {
        message: watchedMode
          ? EXCEPTION_MESSAGE.NO_WATCHED_VIDEO
          : EXCEPTION_MESSAGE.NO_WATCHING_VIDEO,
      });
      return;
    }

    new SavedVideoCardList(this.$('#saved-video-list'), {
      watchedMode,
    });
  }

  shouldShowNotFound() {
    const { hasWatchedVideo, hasWatchingVideo } = rootStore.state;
    const { watchedMode } = this.state;

    return (
      (watchedMode && !hasWatchedVideo) || (!watchedMode && !hasWatchingVideo)
    );
  }

  setEvent() {
    this.addEvent(
      'click',
      '#search-modal-button',
      this.props.toggleSearchModal
    );
    this.addEvent('click', '.nav-left', this.handleMode.bind(this));
  }

  handleMode(e: Event) {
    if (!(e.target instanceof HTMLInputElement)) return;

    if (!e.target.name) {
      return;
    }
    if (e.target.classList.contains('active')) {
      return;
    }

    const { watchedMode } = this.state;
    this.setState<{ watchedMode: boolean }>({ watchedMode: !watchedMode });
  }
}
